import React from "react";
import Link from "next/link";
import type { Metadata } from 'next'
import { ApplicationItem, ApplicationList } from "@/components/console/application-list";
import { FormPageLayout } from "@app/ui/layouts";
import { UnderlineButton } from "@app/ui/components";


export const metadata: Metadata = {
  title: "CORS.SH - Console",
}

export default function ConsoleIndex() {
  const applications = [
    {
      id: "1",
      name: "My app",
    },
    {
      id: "2",
      name: "My app 2",
    },
  ]

  return (
    <>
      <FormPageLayout>
        {/* <Logo /> */}
        <div style={{ height: 80 }} />
        <ApplicationList>
          {applications.map((application) => (
            <ApplicationItem key={application.id} {...application} />
          ))}
        </ApplicationList>
        <div style={{ height: 80 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Link href="/new">
            {/* <UnderlineButton> */}
            Create new application
            {/* </UnderlineButton> */}
          </Link>
          <Link href="/subscriptions">
            {/* <UnderlineButton> */}
            Manage subscription
            {/* </UnderlineButton> */}
          </Link>
        </div>
      </FormPageLayout>
    </>
  );
}
