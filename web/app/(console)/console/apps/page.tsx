import React from "react";
import Link from "next/link";
import type { Metadata } from 'next'
import { ApplicationItem } from "@/components/console/application-list";

export const metadata: Metadata = {
  title: "Dashboard",
}

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

export default function AppsPage() {

  return (
    <main className="p-4">
      <header className="mt-20 flex flex-row items-center justify-between">
        <Link href="/console/apps/new">
          <button className="px-5 py-3 rounded-md bg-black dark:bg-white text-white dark:text-white">
            New Application
          </button>
        </Link>
      </header>
      <div className="mt-20">
        <div className="flex">
          {applications.map((application) => (
            <Link key={application.id} href={`/console/apps/${application.id}`}>
              <ApplicationItem {...application} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
