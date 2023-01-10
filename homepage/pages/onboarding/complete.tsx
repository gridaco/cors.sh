import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { Client, ApplicationWithApiKey } from "@cors.sh/service-api";
import Head from "next/head";
import { FormPageLayout, PageCloseButton } from "@app/ui/layouts";

export default function InitialOnboardingFinalPage({
  application,
}: {
  application: ApplicationWithApiKey;
}) {
  return (
    <>
      <Head>
        <title>CORS.SH - Complete</title>
      </Head>
      <FormPageLayout>
        <PageCloseButton />
        <>
          <h1>Extend your api call with proxy.cors.sh.</h1>
          <p>
            We’re all set. Let’s get rid of the cors error by extending the api
            call with proxy.cors.sh like below.
          </p>
          <div className="body">
            <VideoDemo />
            <CodeExamples apikey={application.apikey_test} />
          </div>
          <div style={{ height: 30 }} />
          <div>
            <button>Move to dashboard</button>
            <button>I need help</button>
          </div>
        </>
      </FormPageLayout>
    </>
  );
}

function CodeExamples({ apikey }: { apikey: string }) {
  return (
    <CodeBlock>
      <pre>
        GET https://proxy.corsh.sh/https://instragram.com/posts/123
        <br />
        -h x-cors-api-key {apikey}
      </pre>
    </CodeBlock>
  );
}

const CodeBlock = styled.code`
  background: black;
  color: white;
  border-radius: 4px;
  padding: 20px;
  display: block;
  font-size: 12px;
  line-height: 1.5;
  font-family: monospace;
  overflow: scroll;

  pre {
    margin: 0;
  }
`;

function VideoDemo() {
  return (
    <div className="video-demo">
      <video
        style={{
          borderRadius: "4px",
          overflow: "hidden",
        }}
        autoPlay
        loop
        muted
        playsInline
        width="100%"
        height="100%"
      >
        <source
          src="/console/demo-of-initial-api-key-configuration.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { app, checkout_session_id } = context.query;

  if (!app) {
    return {
      redirect: {
        destination: "/console",
        permanent: false,
      },
    };
  }

  try {
    const client = new Client({
      "x-cors-service-checkout-session-id": checkout_session_id,
    });

    const application = await client.getApplication(app);

    return {
      props: {
        application,
      },
    };
  } catch (e) {
    console.error(e);
    // 404
    return {
      notFound: true,
    };
  }
}
