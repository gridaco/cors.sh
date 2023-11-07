import React from "react";
import type { Metadata } from 'next'
import client from "@cors.sh/service-api";
import { Button } from "@editor-ui/console";

export const metadata: Metadata = {
  title: "CORS.SH - Problem with your subscription"
}

export default function PaymentSuccessButThereWasAProblem({
  error,
  message,
  session,
  application,
}: {
  error: "identity_conflict" | string;
  message: string;
  session: string;
  application: {
    id: string;
    name: string;
  };
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: 80,
          textAlign: "center",
        }}
      >
        <h1>There was a problem with your subscription - &quot;{error}&quot;</h1>

        <div style={{ height: 40 }} />
        <p>{message}</p>

        <h5>Your Information</h5>
        <p>Copy the data below when you contact customer support</p>
        <div style={{ height: 40 }} />
        <code>
          <pre>session: {session}</pre>
          <pre>
            application: {application.id} ({application.name})
          </pre>
        </code>

        <div style={{ height: 40 }} />
        <a href={`mailto:hello@grida.co`}>
          <Button>Contact Support</Button>
        </a>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { error, message, session_id, application_id, onboarding_id } =
    context.query;
  if (!session_id || !application_id || !onboarding_id) {
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
        error,
        message,
        session: session_id || null,
        application,
      },
    };
  } catch (e) {
    // 404
    return {
      notFound: true,
    };
  }
}
