"use client";

import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";

export function ApplicationList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-stretch w-full gap-2">{children}</div>
  );
}

export function ApplicationItem({ id, name }: { id: string; name: string }) {
  return (
    <Link href={`/${id}`}>
      <div
        className={cn(
          "flex items-center justify-between p-5 rounded-md border border-border/50",
          "hover:bg-accent hover:border-border transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
      >
        <span className="text-sm">
          {name} ({id})
        </span>
        <ArrowRightIcon className="w-4 h-4 text-muted-foreground" />
      </div>
    </Link>
  );
}
