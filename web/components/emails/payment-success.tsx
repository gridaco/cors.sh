import React from "react";
import { Button, Head, Tailwind } from "@react-email/components";

const HOST = process.env.NEXT_PUBLIC_HOST || "http://localhost:8823";

export const subject = "CORS.SH | Your first project"

interface PaymentSuccessEmailTemplateProps {
  applicationName: string;
  codeTest: string;
  codeLive: string;
}

export function PaymentSuccessEmailTemplate({applicationName,
  codeTest,
  codeLive,}: PaymentSuccessEmailTemplateProps) {
  return (
    <Tailwind>
      <div style={{ backgroundColor: "#eee", fontFamily: "'Source Code Pro', monospace" }}>
        <Head>
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <div style={{ padding: "24px 0 0 0", backgroundColor: "#eee", textAlign: "center" }}>
          <h1 style={{ color: "black" }}>Thank you for<br />your subscription</h1>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "20px" }}>
          <p>We’re all set. Let’s get rid of the cors errors by extending your api call with proxy.cors.sh like below.</p>
          <h3 style={{ fontWeight: "bold" }}>Your API key for your first application “{applicationName}” is..</h3>
          <p style={{ backgroundColor: "black", color: "white", padding: "12px", wordBreak: "break-all" }}>
            # for testing<br />{codeTest}<br /><br /># for production<br />{codeLive}
          </p>
          <p>Copy & Paste this api key to your api call (XHR) header.</p>
          <h3 style={{ fontWeight: "bold" }}>Example usage</h3>
          <p>You can use the api key like below. For more example, visit <a href="https://cors.sh/#usage">https://cors.sh/#usage</a></p>
          <div style={{ backgroundColor: "#F4F2F0", overflow: "auto", padding: "12px" }}>
            <CodeBlock2 codeTest={codeTest}/>
          </div>
          <p><a href="https://cors.sh/docs">Read the docs</a></p>
        </div>
        {/* footer */}
        <div style={{ backgroundColor: "#fff", padding: "20px", textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HOST + "/email-content/CORS.SH-black.svg"}
            alt="CORS.SH Logo"
            style={{ height: 24 }}
          />
          <p style={{ color: "rgba(0, 0, 0, 0.5)" }}>
            <small><a href="https://grida.co">A Grida Product</a> | <a href="https://cors.sh/contact">Contact</a></small>
          </p>
        </div>
      </div>
    </Tailwind>
  );
}

function CodeBlock2({ codeTest}: {
  codeTest: string;
}) {
  return (<pre style={{ backgroundColor: "#F4F2F0", overflow: "auto", width: "auto", padding: "12px" }}>
  <div style={{ margin: 0, lineHeight: "125%" }}>
    <span style={{ color: "#CC556A" }}>fetch</span>
    <span style={{ color: "#999999" }}>(</span>
    <span style={{ color: "#71982C" }}>&#39;https://proxy.cors.sh/https://acme.com&#39;</span>
    <span style={{ color: "#999999" }}>,</span>
    <span style={{ color: "#999999" }}>&#123;</span>
    <br />
    &nbsp;&nbsp;<span style={{ color: "#CC556A" }}>headers</span>
    <span style={{ color: "#937042" }}>:</span>
    <span style={{ color: "#999999" }}>&#123;</span>
    <br />
    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#71982C" }}>&#39;x-cors-api-key&#39;</span>
    <span style={{ color: "#937042" }}>:</span>
    &nbsp;<span style={{ color: "#71982C" }}>&#39;{codeTest}&#39;</span>
    <br />
    &nbsp;&nbsp;<span style={{ color: "#999999" }}>&#125;</span>
    <br />
    <span style={{ color: "#999999" }}>&#125;)</span>
    <br />
  </div>
</pre>)
}