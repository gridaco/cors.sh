import * as React from "react";
import Link from "next/link";
import { ArrowRight, Gauge, Globe, KeyRound, PlugZap, ShieldCheck, Waves } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { HomeBackground } from "@/components/home-background";
import { HomeDemoCard } from "@/components/home-demo-card";

const FEATURES = [
  {
    icon: KeyRound,
    title: "Origin-pinned keys",
    body: "Your API key is public by design — the unforgeable Origin header is the real auth. live_ keys are pinned to your domains; test_ keys work anywhere.",
  },
  {
    icon: Gauge,
    title: "Edge-fast",
    body: "Runs on Cloudflare Workers in 300+ cities. Auth resolves from KV in ~6ms on the hot path, close to your users.",
  },
  {
    icon: Waves,
    title: "Streaming proxy",
    body: "Responses stream through byte-for-byte with flat memory — large payloads and chunked transfers just work.",
  },
  {
    icon: PlugZap,
    title: "Drop-in",
    body: "Prefix your URL and add one header. No SDK, no backend, no build step. Works with fetch, axios, anything.",
  },
  {
    icon: ShieldCheck,
    title: "Abuse controls",
    body: "Per-key allowed origins and upstream targets, generous quotas, and rotation keep a leaked key from costing you.",
  },
  {
    icon: Globe,
    title: "Generous quotas",
    body: "500,000 requests and 500 GB of bandwidth on Pro. Scale to millions on Team — no per-hour throttling.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create a project",
    body: "Spin up a project in the console and pin it to your origins. You get a live and a test key instantly.",
  },
  {
    n: "02",
    title: "Add the header",
    body: "Prefix your request URL with proxy.cors.sh/ and send your key in the x-cors-api-key header.",
  },
  {
    n: "03",
    title: "Ship",
    body: "Your frontend talks to any API, CORS errors gone. Watch requests and bandwidth in the console.",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeBackground />

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary" className="gap-1.5 rounded-full">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Now running on Cloudflare&apos;s edge
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              The CORS proxy you&apos;ll <span className="text-muted-foreground">
                actually
              </span>{" "}
              trust.
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Sick of CORS errors? Prefix your URL, add one header, and call any API from the
              browser — fast, secure, and serverless.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-11 rounded-lg px-6 text-sm">
                <Link href="/console/new">
                  Get your API key <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 rounded-lg px-6 text-sm">
                <Link href="/docs">Read the docs</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Free tier included · No credit card to start
            </p>
          </div>

          <div className="lg:pl-6">
            <HomeDemoCard />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">Everything a frontend dev needs</h2>
          <p className="mt-3 text-muted-foreground">
            Built for the developer who doesn&apos;t want to run a server just to dodge a CORS
            error.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-background p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg border bg-muted/50">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-12 text-3xl font-semibold tracking-tight">Live in under a minute</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="space-y-3">
                <div className="font-mono text-sm text-muted-foreground">{s.n}</div>
                <h3 className="text-lg font-medium">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border bg-muted/40 px-8 py-16 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,theme(colors.foreground/8%),transparent)]"
          />
          <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop fighting CORS. Start shipping.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Create a project, grab your key, and make your first proxied request in the next sixty
            seconds.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg" className="h-11 rounded-lg px-6 text-sm">
              <Link href="/console/new">
                Get started <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 rounded-lg px-6 text-sm">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
