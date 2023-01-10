import React, { useEffect } from "react";
import styled from "@emotion/styled";
import client from "@cors.sh/service-api";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Button,
  FormFieldBase,
  FormFieldLabel,
  TextFormField,
} from "@editor-ui/console";
import { FormPageLayout, PageCloseButton } from "@app/ui/layouts";

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
  const router = useRouter();

  return (
    <>
      <Head>
        <title>CORS.SH - Complete</title>
        <FormPageLayout>
          <PageCloseButton />
          <>
            <h1>Thank you for your subscription</h1>
            <p className="description">
              You can now create as many project you want without unlimited
              hourly rate :)
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
              <Button
                onClick={(e) => {
                  alert("AA");
                  // convert to application.
                  // move to complete
                  router.push("/onboarding/complete");
                }}
                height={"32px"}
              >
                Continue
              </Button>
            </div>
          </>
        </FormPageLayout>
      </Head>
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

  const application = await client.getOnboardingApplication(onboarding_id);

  return {
    props: {
      session: session_id || null,
      application,
      customer_id,
    },
  };
}
