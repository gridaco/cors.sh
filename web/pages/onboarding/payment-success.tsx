import React, { useEffect } from "react";
import client from "@cors.sh/service-api";
import { useRouter } from "next/router";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  FormPageLayout,
  FormPageTitle,
  FormPageDescription,
  FormPageForm,
} from "@/components/layouts/form-page-layout";
import { toast } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CORS.SH - Complete",
};

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
    <FormPageLayout>
      <FormPageTitle>Thank you for your subscription</FormPageTitle>
      <FormPageDescription>
        You can now create as many project you want without unlimited hourly
        rate :)
        <br />
        <br />
        <span className="font-semibold">
          Let's finish up your first project.
        </span>
      </FormPageDescription>

      <FormPageForm>
        <div className="space-y-2">
          <Label htmlFor="name">Application name</Label>
          <Input
            id="name"
            placeholder="my-portfolio-website"
            value={application.name}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="origins">Application origin URL</Label>
          <Input
            id="origins"
            placeholder="http://localhost:3000, https://my-site.com"
            readOnly
            value={application.allowedOrigins.join(", ")}
          />
          <p className="text-xs text-muted-foreground">
            You can add up to 3 urls of your site
          </p>
        </div>

        <div className="h-4" />
        <Button className="w-full" onClick={onNext} disabled={isBusy}>
          Continue
        </Button>
      </FormPageForm>
    </FormPageLayout>
  );
}

export async function getServerSideProps(context: any) {
  const { session_id, application_id, customer_id, onboarding_id } =
    context.query;
  if (!session_id || !onboarding_id) {
    // invalid entry
    return {
      redirect: {
        destination: "/",
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
