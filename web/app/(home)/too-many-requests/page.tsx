'use client';

import React from "react";
import * as k from "@/k";
import Link from "next/link";

export default function TooMayRequestsPage() {
  return (
    <main className="max-w-screen-xl m-auto flex min-h-screen flex-col items-center justify-center p-10 text-center md:text-start">
      <div className="flex flex-col gap-6 items-center text-center">
        <h1
          className="text-4xl lg:text-7xl font-black"
        >Too many requests.</h1>
        <p className="max-w-screen-sm opacity-80">
          We’re sorry to tell you that you’ve reached your hourly request limit for free-tier.
          Upgrade your plan to remove this limit.
        </p>
      </div>
      <div className="h-20" />
      <Link href="/console">
        <button className="bg-neutral-50 text-neutral-950 p-5 rounded-sm">Sign-in to continue</button>
      </Link>
    </main>
  );
}
