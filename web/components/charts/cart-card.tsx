import React from "react";

export function ChartCard({ label, children }: React.PropsWithChildren<{
  label: string | React.ReactNode;
}>) {
  return <div
    className="bg-white rounded-md shadow-sm p-4 border border-neutral-200"
  >
    <header>
      <h2>
        {label}
      </h2>
    </header>
    {children}
  </div>
}