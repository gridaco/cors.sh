import React from "react";
import Link from "next/link";
import type { Metadata } from 'next'
import { ApplicationItem } from "@/console/application-item";
import { Client } from "@cors.sh/service-api";
import { Button, Form, FormHeader, FormRow } from "@/console";

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function AppsPage() {
  const client = new Client({});
  const applications = await client.listApplications()

  return (
    <main className="p-10">
      <header className="mt-20 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">
          Applications
        </h1>
        <Link href="/console/applications/new">
          <Button>
            New Application
          </Button>
        </Link>
      </header>
      <div className="mt-20">
        {
          applications.length === 0
            ? <Empty />
            : (
              <div
                className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {applications.map((application) => (
                  <Link key={application.id} href={`/console/applications/${application.id}`}>
                    <ApplicationItem {...application} />
                  </Link>
                ))}
              </div>
            )
        }

      </div>
    </main>
  );
}

function Empty() {
  return (
    <Form>
      <FormHeader>
        You don&apos;t have any applications yet
      </FormHeader>
      <FormRow noborder>
        <Link href="/console/applications/new">
          <Button>
            New Application
          </Button>
        </Link>
      </FormRow>
    </Form>
  )
}