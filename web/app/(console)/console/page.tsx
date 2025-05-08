import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ApplicationItem,
  ApplicationList,
} from "./_components/application-list";
import {
  FormPageLayout,
  FormPageTitle,
  FormPageForm,
} from "@/components/layouts/form-page-layout";
import { Button } from "@workspace/ui/components/button";

export const metadata: Metadata = {
  title: "Dashboard",
};

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
  ];

  return (
    <FormPageLayout>
      <FormPageTitle>Dashboard</FormPageTitle>
      <div className="h-20" />
      <ApplicationList>
        {applications.map((application) => (
          <ApplicationItem key={application.id} {...application} />
        ))}
      </ApplicationList>
      <div className="h-20" />
      <FormPageForm>
        <div className="flex flex-col gap-2">
          <Button asChild variant="link" className="justify-start">
            <Link href="/new">Create new application</Link>
          </Button>
          <Button asChild variant="link" className="justify-start">
            <Link href="/subscriptions">Manage subscription</Link>
          </Button>
        </div>
      </FormPageForm>
    </FormPageLayout>
  );
}
