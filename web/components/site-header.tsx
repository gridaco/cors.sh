"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Logo } from "@/components/logo";
import { GridaLogo } from "@/components/logo-grida";
import { GitHubIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/pricing", label: "Pricing" },
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-2">
          <GridaLogo className="size-4 text-foreground" />
          <span className="text-border">/</span>
          <Logo className="h-3 w-auto text-foreground" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1.5">
          <Button asChild variant="ghost" size="icon" aria-label="GitHub">
            <Link href="https://github.com/gridaco/cors.sh" target="_blank">
              <GitHubIcon className="size-4" />
            </Link>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" className="ml-1 h-8 px-3 text-xs">
            <Link href="/console">Open Console</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
