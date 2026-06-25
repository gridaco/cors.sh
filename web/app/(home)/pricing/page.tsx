import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, generous pricing for the CORS.SH proxy. Free to start, scale to millions of requests on Pro and Team.",
};

type Tier = {
  name: string;
  price: string;
  cadence?: string;
  blurb: string;
  cta: string;
  href: string;
  featured?: boolean;
  features: string[];
};

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    blurb: "For side projects and trying things out.",
    cta: "Start free",
    href: "/console/new",
    features: [
      "10,000 requests / month",
      "5 GB bandwidth / month",
      "Unlimited projects",
      "Origin-pinned live keys",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$4",
    cadence: "/ month",
    blurb: "For production frontends with real traffic.",
    cta: "Get started",
    href: "/console/new",
    featured: true,
    features: [
      "500,000 requests / month",
      "500 GB bandwidth / month",
      "Unlimited projects",
      "No hourly request limit",
      "Up to 6 MB per request",
      "Email support",
    ],
  },
  {
    name: "Team",
    price: "Custom",
    blurb: "For high-volume apps and businesses.",
    cta: "Contact us",
    href: "/contact",
    features: [
      "5,000,000+ requests / month",
      "1 TB+ bandwidth / month",
      "Priority routing",
      "SSO & shared projects",
      "SLA & priority support",
    ],
  },
];

const FAQ = [
  {
    q: "Can I use CORS.SH for multiple websites?",
    a: "Yes. A single subscription covers unlimited projects and websites, as long as you stay within your plan's monthly quota.",
  },
  {
    q: "What's the difference between a live and a test key?",
    a: "A live_ key is pinned to your project's allowed origins and rejects requests from anywhere else — safe to ship in your frontend. A test_ key isn't origin-restricted (great for localhost, curl, and CI) but carries a tighter rate cap.",
  },
  {
    q: "Is it free for open source?",
    a: "Open-source projects with 5+ stars can apply to our OSS program for a free Pro plan. Open an issue on GitHub to apply.",
  },
  {
    q: "What happens if I hit my quota?",
    a: "Requests beyond your monthly quota are rejected with a 429 until the next period. Upgrade any time to raise your limits instantly.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Simple, generous pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free. Upgrade when your traffic does. No per-hour throttling,
          no surprises.
        </p>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-background p-8",
              tier.featured && "border-foreground/20 shadow-lg ring-1 ring-foreground/10"
            )}
          >
            {tier.featured && (
              <Badge className="absolute -top-3 left-8">Most popular</Badge>
            )}
            <h2 className="text-lg font-medium">{tier.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{tier.blurb}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">
                {tier.price}
              </span>
              {tier.cadence && (
                <span className="text-sm text-muted-foreground">
                  {tier.cadence}
                </span>
              )}
            </div>
            <Button
              asChild
              className="mt-6 h-9 text-sm"
              variant={tier.featured ? "default" : "outline"}
            >
              <Link href={tier.href}>{tier.cta}</Link>
            </Button>
            <ul className="mt-8 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-24 max-w-2xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-8 w-full">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
