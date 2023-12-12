import BarChart from "@/components/charts/bar-chart"
import { ChartCard } from "@/components/charts/cart-card"
import React from "react"

export default function UsagePage() {
  return (
    <main className="p-10">
      <header className="mt-20 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">
          Usage
        </h1>
      </header>
      <ChartCard label="Requests">
        <BarChart width={400} height={300} />
      </ChartCard>
    </main>
  )
}