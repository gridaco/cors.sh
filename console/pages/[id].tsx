import React from "react";

export default function ApplicationDetailPage({
  application,
}: {
  application: any;
}) {
  //
  return <></>;
}

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  const res = await fetch(`https://.../api/applications/${id}`);
  const application = await res.json();
  return {
    props: {
      application,
    },
  };
}
