// TODO: rename this route to /onboarding/continue?id=

import Head from "next/head";
import { redirect } from "next/navigation";
import React from "react";

export default function ContinueOnboardingWithVerification() {
  redirect("/get-started");

  return (
    <>
      <Head>
        <title>Redirecting..</title>
      </Head>
      <h1>Redirecting..</h1>
    </>
  );
}
