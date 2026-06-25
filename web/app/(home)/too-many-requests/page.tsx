import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export const metadata: Metadata = {
  title: "Too many requests",
};

export default function TooManyRequestsPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-sm text-muted-foreground">429</span>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Too many requests</h1>
      <p className="mt-4 text-muted-foreground">
        You&apos;ve reached your plan&apos;s request limit for this period. Upgrade to raise your
        quota and remove hourly throttling.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/pricing">View plans</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/console">Go to console</Link>
        </Button>
      </div>
    </div>
  );
}
