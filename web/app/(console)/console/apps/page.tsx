import React from "react";
import Link from "next/link";
import type { Metadata } from 'next'
import { ApplicationItem } from "@/components/console/application-item";

export const metadata: Metadata = {
  title: "Dashboard",
}

const applications = [
  {
    id: "1",
    name: "My app",
    allowedOrigins: ["https://example.com"],
  },
  {
    id: "2",
    name: "My app 2",
    allowedOrigins: ["https://example.com"],
  },
]

export default function AppsPage() {

  return (
    <main className="p-10">
      <header className="mt-20 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">
          Applications
        </h1>
        <Link href="/console/apps/new">
          <button className="px-5 py-3 rounded-md bg-black dark:bg-white text-white dark:text-white">
            New Application
          </button>
        </Link>
      </header>
      <div className="mt-20">
        <div
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
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
