// TODO: rename this route to /onboarding/continue?id=

import Head from "next/head";
import React from "react";

export default function ContinueOnboardingWithVerification() {
  return (
    <>
      <Head>
        <title>Redirecting..</title>
      </Head>
      <h1>Redirecting..</h1>
    </>
  );
}

export async function getServerSideProps() {
  //
  // TODO: fully implement.
  // for now, redirect to get-started
  return {
    redirect: {
      destination: "/get-started",
      permanent: false,
    },
  };
}
