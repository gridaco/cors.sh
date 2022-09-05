import React from "react";
import client, { ApplicationWithApiKey } from "@cors.sh/service-api";
export default function ApplicationDetailPage({
  application,
}: {
  application: ApplicationWithApiKey;
}) {
  return (
    <>
      id: {application.id}
      <br />
      livekey: {application.apikey_test}
      <br />
      testkey: {application.apikey_test}
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  const application = await client.getApplication(id);
  return {
    props: {
      application,
    },
  };
}
