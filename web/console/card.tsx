import React from "react";

export function Card({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex flex-col bg-white dark:bg-neutral-900 shadow-lg border rounded-md">
      {children}
    </div>
  )
}