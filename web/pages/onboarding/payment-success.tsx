import React, { useEffect } from "react";
import client from "@cors.sh/service-api";
import { useRouter } from "next/router";
import { Button, TextFormField } from "@editor-ui/console";
import { FormPageLayout, PageCloseButton } from "@app/ui/layouts";
import { toast } from "react-hot-toast";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "CORS.SH - Complete"
}

// page redirected from stripe once the payment is successful
export default function PaymentSuccessPage({
  application,
  session,
  isOnboarding,
}: {
  session: string;
  isOnboarding: boolean;
  application: {
    id: string;
    name: string;
    allowedOrigins: string[];
  };
}) {
  const [isBusy, setBusy] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    // GA4 conversion - Purchase
    // @ts-ignore
    window.gtag?.("event", "purchase", {
      transaction_id: session,
      value: 4,
      currency: "USD",
      //
    });
  }, []);

  const onNext = () => {
    setBusy(true);
    // convert to application.
    client
      .convertApplication(application.id, session)
      .then((d) => {
        // move to complete
        router.push({
          pathname: "/onboarding/complete",
          query: {
            app: d.id,
            checkout_session_id: session,
          },
        });
      })
      .catch((e) => {
        toast.error("Something went wrong. Please try again later.");
      })
      .finally(() => {
        setBusy(false);
      });
  };

  return (
    <>

      <FormPageLayout>
        <>
          <h1>Thank you for your subscription</h1>
          <p className="description">
            You can now create as many project you want without unlimited hourly
            rate :)
            <br />
            <br />
            <b>Let’s finish up your first project.</b>
          </p>
          <div className="form">
            <TextFormField
              label="Application name"
              placeholder="my-portfolio-website"
              value={application.name}
              readonly
            />
            <TextFormField
              label="Application origin URL"
              placeholder="http://localhost:3000, https://my-site.com"
              readonly
              value={application.allowedOrigins.join(", ")}
              helpText="You can add up to 3 urls of your site"
            />
            <div style={{ height: 16 }} />
            <Button onClick={onNext} height={"32px"} disabled={isBusy}>
              Continue
            </Button>
          </div>
        </>
      </FormPageLayout>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { session_id, application_id, customer_id, onboarding_id } =
    context.query;
  if (!session_id) {
    // invalid entry
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!onboarding_id) {
    return {
      redirect: {
        destination: "/console",
        permanent: false,
      },
    };
  }

  try {
    const application = await client.getOnboardingApplication(onboarding_id);
    return {
      props: {
        session: session_id || null,
        application,
        customer_id,
      },
    };
  } catch (e) {
    // 404
    return {
      notFound: true,
    };
  }
}
