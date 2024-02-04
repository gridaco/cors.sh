import React from "react";
import { Button, Head, Tailwind } from "@react-email/components";

const HOST = process.env.NEXT_PUBLIC_HOST || "http://localhost:8823";

interface OnboardingEmailTemplateProps {
  code: string;
  onboarding_url: string;
}

export const subject = "CORS.SH | your API Key for cors.proxy.sh";

export function OnboardingEmailTemplate({
  code,
  onboarding_url,
}: OnboardingEmailTemplateProps) {
  return (
    <Tailwind>
      <div
        style={{
          backgroundColor: "#eee",
          fontFamily: "'Source Code Pro', monospace",
        }}
      >
        <Head>
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <div style={{ backgroundColor: "#fff" }}>
          <h1 style={{ textAlign: "center", color: "black" }}>
            Your API key for
            <br />
            proxy.cors.sh
          </h1>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#fff" }}>
          <h3 style={{ fontWeight: "bold" }}>Your temporary API key is..</h3>
          <p
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "12px",
              wordBreak: "break-all",
            }}
          >
            {code}
          </p>
          <p>Copy & Paste this api key to your api call (XHR) header.</p>
          <h3 style={{ fontWeight: "bold" }}>Example usage</h3>
          <p>
            You can use the api key like below. For more example, visit{" "}
            <a href="https://cors.sh/#usage">https://cors.sh/#usage</a>
          </p>
          <div
            style={{
              backgroundColor: "#F4F2F0",
              overflow: "auto",
              width: "auto",
              padding: "12px",
            }}
          >
            <CodeBlock code={code} />
          </div>
          <h3 className="font-bold">Next (Action required)</h3>
          <p>
            Since this key is a temporary key to get you started, you have to
            sign-in & claim your account to get a permanent one.{" "}
            <strong>This key will only be valid for 3 days.</strong>
          </p>
          <Button href={onboarding_url} className="bg-black text-white">
            👉 Get the permanent key
          </Button>
          <p className="text-black/50">
            <small>
              button not working? copy & paste this link to your browser
            </small>
            <br />
            <small>
              <a href={onboarding_url}>{onboarding_url}</a>
            </small>
          </p>
        </div>
        {/* footer */}
        <div className="bg-white p-5 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HOST + "/email-content/CORS.SH-black.svg"}
            alt="CORS.SH Logo"
            style={{ height: 24 }}
          />
          <p style={{ color: "rgba(0, 0, 0, 0.5)" }}>
            <small>
              <a href="https://grida.co">A Grida Product</a> |{" "}
              <a href="https://cors.sh/contact">Contact</a>
            </small>
          </p>
        </div>
      </div>
    </Tailwind>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <code>
      <pre
        style={{
          backgroundColor: "#F4F2F0",
          overflow: "auto",
          width: "auto",
          padding: "12px",
          margin: 0,
          lineHeight: "125%",
        }}
      >
        <span style={{ color: "#CC556A" }}>fetch</span>
        <span style={{ color: "#999999" }}>(</span>
        <span style={{ color: "#71982C" }}>
          &#39;https://proxy.cors.sh/https://acme.com&#39;
        </span>
        <span style={{ color: "#999999" }}>,</span>
        <span style={{ color: "#999999" }}>&#123;</span>
        <br />
        &nbsp;&nbsp;<span style={{ color: "#CC556A" }}>headers</span>
        <span style={{ color: "#937042" }}>:</span>
        <span style={{ color: "#999999" }}>&#123;</span>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span style={{ color: "#71982C" }}>&#39;x-cors-api-key&#39;</span>
        <span style={{ color: "#937042" }}>:</span>
        &nbsp;<span style={{ color: "#71982C" }}>&#39;{code}&#39;</span>
        <br />
        &nbsp;&nbsp;<span style={{ color: "#999999" }}>&#125;</span>
        <br />
        <span style={{ color: "#999999" }}>&#125;)</span>
        <br />
      </pre>
    </code>
  );
}
