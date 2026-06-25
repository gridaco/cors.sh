import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

const GROUPS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/console", label: "Console" },
      { href: "/pricing", label: "Pricing" },
      { href: "/playground", label: "Playground" },
      { href: "/docs", label: "Docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "https://grida.co", label: "Grida", external: true },
      { href: "/contact", label: "Contact" },
      {
        href: "https://github.com/gridaco/cors.sh",
        label: "GitHub",
        external: true,
      },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div className="col-span-2 space-y-3 md:col-span-2">
          <Logo className="h-3.5 w-auto text-foreground" />
          <p className="max-w-xs text-sm text-muted-foreground">
            A fast, reliable CORS proxy for your frontend. Drop the server,
            keep shipping.
          </p>
        </div>
        {GROUPS.map((group) => (
          <div key={group.title} className="space-y-3">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h4>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Grida, Inc. All rights reserved.</span>
          <span>Built on Cloudflare&apos;s edge network.</span>
        </div>
      </div>
    </footer>
  );
}
