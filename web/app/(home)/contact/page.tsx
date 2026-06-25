import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { GitHubIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the CORS.SH team.",
};

const CHANNELS = [
  {
    icon: MessageSquare,
    title: "Join our Slack",
    body: "Chat with the team and other developers. Fastest way to reach us.",
    href: "https://grida.co/join-slack",
    cta: "Open Slack",
  },
  {
    icon: GitHubIcon,
    title: "GitHub",
    body: "Report a bug, request a feature, or apply to the OSS program.",
    href: "https://github.com/gridaco/cors.sh",
    cta: "Open GitHub",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">Get in touch</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Questions about pricing, enterprise, or the OSS program? We&apos;re happy
        to help.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {CHANNELS.map((c) => (
          <div key={c.title} className="rounded-2xl border bg-background p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg border bg-muted/50">
              <c.icon className="size-5" />
            </div>
            <h2 className="font-medium">{c.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href={c.href} target="_blank">
                {c.cta} <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
