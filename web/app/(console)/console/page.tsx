import React from "react";
import Link from "next/link";
import type { Metadata } from 'next'
import { ApplicationItem } from "@/components/console/application-item";
import BarChart from "@/components/charts/bar-chart";
import { Prism } from "@/components/prism";
import { examples } from "@/k";
import { ChartCard } from "@/components/charts/cart-card";

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

export default function ConsoleHome() {

  return (
    <main className="p-10">
      <header className="mt-20 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>
        <Link href="/console/apps/new">
          <button className="px-5 py-3 rounded-md bg-black dark:bg-white text-white dark:text-white">
            New Application
          </button>
        </Link>
      </header>
      <section className="mt-12">
        <header className="mb-8">
          <h2 className="text-2xl font-bold">
            Usage
          </h2>
        </header>
        <ChartCard label="Requests">
          <BarChart width={400} height={300} />
        </ChartCard>
      </section>
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
      <section className="mt-12">
        <h2 className="text-2xl font-bold">
          QuickStarts
        </h2>
        <div>
          <Prism style={{
            fontSize: 14,
          }}>
            {examples.fetch('https://example.com')}
          </Prism>
        </div>
        <div
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {quick_starts.map((d, i) => {
            return <QuickStartCard {...d} key={i} />
          })}
        </div>
      </section>

    </main>
  );
}

const quick_starts = [
  {
    title: "Ticktok",
    description: "Learn how to integrate Ticktok API with your application",
  },
  {
    title: "Shopify",
    description: "Learn how to integrate Ticktok API with your application",
  },
  {
    title: "Your Server",
    description: "Learn how to integrate CORS Proxy to your own server",
  },
] as const

function QuickStartCard({
  icon,
  title,
  description,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button className="bg-white dark:bg-neutral-900 rounded-md p-4 flex flex-col items-start justify-start text-start">
      <h5 className="text-lg font-bold">
        {title}
      </h5>
      <p className="text-sm mt-2">
        {description}
      </p>
    </button>
  )
}
