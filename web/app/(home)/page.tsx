import React from "react";
import { SendMeAnApiKeyForm } from "./_home/send-me-an-api-key-form";
import { HomeBackground } from "./_home/home-background";
import { HomeCardExample } from "./_home/home-hover-card";

export default function Home() {
  return (
    <main className="max-w-screen-xl overflow-x-visible m-auto flex min-h-screen flex-col items-center md:items-stretch justify-center p-10 text-center md:text-start">
      <HomeBackground />
      <div className="flex flex-col mb-40 mt-40 md:mb-0 md:mt-0 md:flex-row gap-20 justify-between items-center md:items-stretch">
        <div className="flex flex-col gap-16 justify-center max-w-lg">
          <div className="flex flex-col gap-5 max-w-lg">
            <h1 className="text-5xl lg:text-7xl font-black">
              <span
                className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent"
                style={{
                  display: "inline-block",
                }}
              >
                CORS.SH -<br />
                CORS PROXY
              </span>
            </h1>
            <p
              className="text-md lg:text-xl font-regular text-muted-foreground"
              style={{
                lineHeight: "137%",
              }}
            >
              Sick of cors errors? CORS.SH, A fast & reliable cors proxy for
              your websites here for the rescue.
            </p>
          </div>
          <SendMeAnApiKeyForm />
        </div>
        <div className="flex">
          <HomeCardExample />
        </div>
      </div>
    </main>
  );
}
