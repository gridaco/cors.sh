"use client";

import * as React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Logo } from "@/components/logo";
import { GridaLogo } from "@/components/logo-grida";
import { GitHubIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

export interface ConsoleUser {
  email: string;
  name: string | null;
  tier: string;
}

const TIER_LABEL: Record<string, string> = {
  free: "Free plan",
  pro: "Pro plan",
  team: "Team plan",
};

export function ConsoleHeader({ user }: { user: ConsoleUser }) {
  const display = user.name || user.email || "Account";
  const initial = (display[0] || "U").toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-6">
        <Link href="/console" className="flex items-center gap-2">
          <GridaLogo className="size-4 text-foreground" />
          <span className="text-border">/</span>
          <Logo className="h-3 w-auto text-foreground" />
        </Link>
        <span className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Console
        </span>

        <div className="flex flex-1 items-center justify-end gap-1.5">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link href="/docs" target="_blank">
              Docs
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="GitHub">
            <Link href="https://github.com/gridaco/cors.sh" target="_blank">
              <GitHubIcon className="size-4" />
            </Link>
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1 rounded-full">
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs">{initial}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col">
                  <span className="truncate text-sm font-medium">{display}</span>
                  <span className="text-xs text-muted-foreground">
                    {TIER_LABEL[user.tier] ?? "Free plan"}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/console/settings">Account &amp; billing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">Back to site</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
