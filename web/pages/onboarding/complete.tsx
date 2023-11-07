import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { Client, ApplicationWithApiKey } from "@cors.sh/service-api";
import Head from "next/head";
import { FormPageLayout, PageCloseButton } from "@app/ui/layouts";
import { CollapsibleInfoCard } from "@/components/collapsible-info-card";
import { UnderlineButton } from "@app/ui/components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { examples } from "@/k";
import { ApiKeyReveal } from "@app/ui/components";

export default function InitialOnboardingFinalPage({
  application,
}: {
  application: ApplicationWithApiKey;
}) {
  const demo_target_url =
    application.allowedOrigins[0] ?? "https://example.com";

  return (
    <>
      <Head>
        <title>CORS.SH - Complete</title>
      </Head>
      <FormPageLayout>
        <PageCloseButton />
        <>
          <h1>
            Extend your api call with <u>proxy.cors.sh</u>
          </h1>
          <p className="description">
            <small
              style={{
                opacity: 0.5,
              }}
            >
              We&apos;ve sent you an email with the api key.
              <br />
              Please check your inbox :)
            </small>
            <br />
            <br />
            Let’s get rid of the cors errors with proxy.cors.sh like below.
          </p>
          <div style={{ height: 16 }} />
          <div className="body">
            {/* <VideoDemo /> */}

            <CodeExamples
              apikey={application.apikey_test}
              target={demo_target_url}
            />
            <ApiKeyReveal
              keys={{
                test: application.apikey_test,
                prod: application.apikey_live,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <CollapsibleInfoCard title="View more examples">
                <MoreCodeExamples
                  apikey={application.apikey_test}
                  target={demo_target_url}
                />
              </CollapsibleInfoCard>
              <CollapsibleInfoCard title="What's Next?">
                <h5>Useful resources</h5>
                <ul>
                  <li>
                    <a href="https://cors.sh/docs">
                      <u>Learn how to secure your api key</u>
                    </a>
                  </li>
                  <li>
                    <a href="https://cors.sh/docs">
                      <u>Before publishing your website to production</u>
                    </a>
                  </li>
                  <li>
                    <a href="https://cors.sh/docs">
                      <u>Create new application on console</u>
                    </a>
                  </li>
                </ul>
              </CollapsibleInfoCard>
            </div>
          </div>
          <div style={{ height: 30 }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <i style={{ opacity: 0.5 }}>Thank you for using cors.sh 🙏</i>

            <UnderlineButton>Move to dashboard</UnderlineButton>
            <UnderlineButton>I need help</UnderlineButton>
          </div>
        </>
      </FormPageLayout>
    </>
  );
}

function CodeExamples({ target, apikey }: { target: string; apikey: string }) {
  return (
    <CodeBlock language="js">{examples.simplest(target, apikey)}</CodeBlock>
  );
}

function MoreCodeExamples({
  target,
  apikey,
}: {
  target: string;
  apikey: string;
}) {
  return <CodeBlock language="js">{examples.axios(target, apikey)}</CodeBlock>;
}

const CodeBlock = styled(SyntaxHighlighter as any)`
  max-height: 240px;
  font-size: 12px !important;
`;

// <CodeBlock>
//   <pre>
//     GET https://proxy.corsh.sh/https://instragram.com/posts/123
//     <br />
//     -h x-cors-api-key {apikey}
//   </pre>
// </CodeBlock>
// const CodeBlock = styled.code`
//   background: black;
//   color: white;
//   border-radius: 4px;
//   padding: 20px;
//   display: block;
//   font-size: 12px;
//   line-height: 1.5;
//   font-family: monospace;
//   overflow: scroll;

//   pre {
//     margin: 0;
//   }
// `;

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
