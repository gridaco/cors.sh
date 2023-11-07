'use client'

import React, { useState } from "react";
import client from "@cors.sh/service-api";
import { toast } from "react-hot-toast";
import { validateEmail } from "@/utils/email-validation";

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
        window.gtag("event", "sign_up", {
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
    <form className='flex flex-col md:flex-row gap-3'>
      <input
        className='p-5 text-neutral-100 bg-neutral-900 rounded-sm outline-none focus:outline-neutral-900 flex-1 min-w-[200px]'
        type="email"
        autoComplete="email"
        placeholder="alice@acme.com"
        value={email}
        disabled={isBusy}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onsend();
          }
        }}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <button
        className='p-5 pl-6 pr-6 border-neutral-900 border-2 rounded-sm text-xs lg:text-sm font-semibold bg-black'
        disabled={isBusy} onClick={onsend}
      >Send me an API Key</button>
    </form>
  )
}