"use client";

import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { toast } from "sonner";
import { validateEmail } from "@/utils/validate-email";
import client from "@cors.sh/service-api";

export function SendMeAnApiKeyForm() {
  const [isBusy, setIsBusy] = useState(false);
  const [email, setEmail] = useState("");

  const onsend = async () => {
    // validate email
    if (!validateEmail(email)) {
      toast.error(<p>Invalid Email</p>);
      return;
    }

    // send email
    setIsBusy(true);

    client
      .onboardingWithEmail({ email: email })
      .then((data) => {
        toast.success(
          <p>
            API Key sent to your email.
            <br />
            Please check your <b>spam folder</b> as well
          </p>
        );

        // log conversion (signup)
        // @ts-ignore
        window.gtag?.("event", "sign_up", {
          method: "email",
        });
      })
      .catch((e) => {
        toast.error(<p>Something went wrong</p>);
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  //
  return (
    <form
      className="flex flex-col md:flex-row gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onsend();
      }}
    >
      <Input
        className="p-5 flex-1 min-w-[200px] bg-background"
        type="email"
        autoComplete="email"
        placeholder="alice@acme.com"
        value={email}
        disabled={isBusy}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <Button
        className="p-5 pl-6 pr-6 rounded-sm text-xs lg:text-sm font-semibold"
        disabled={isBusy}
        onClick={onsend}
      >
        Send me an API Key
      </Button>
    </form>
  );
}
