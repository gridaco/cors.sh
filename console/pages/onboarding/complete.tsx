import React, { useEffect } from "react";
import styled from "@emotion/styled";

import Head from "next/head";
import { FormPageLayout, PageCloseButton } from "@app/ui/layouts";

export default function InitialOnboardingFinalPage() {
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
            <CodeExamples />
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

function CodeExamples() {
  return (
    <CodeBlock>
      <pre>
        GET https://proxy.corsh.sh/https://instragram.com/posts/123
        <br />
        -h api-key test_xxxxx-xxxx-xxxx
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
