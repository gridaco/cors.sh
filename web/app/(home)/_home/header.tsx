import React from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { SlashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Logo } from "@/components/logo";
import { GridaLogo } from "@/components/logo-grida";

export function Header() {
  return (
    <header className="max-w-screen-xl m-auto left-0 right-0 top-0 p-10 pt-5 pb-5 z-10 w-full items-center justify-between font-mono text-sm md:flex">
      <span className="flex gap-2 items-center w-full justify-center border-b bg-gradient-to-b from-background pb-6 pt-8 backdrop-blur-2xl dark:bg-zinc-800/30 dark:from-inherit md:static md:w-auto  md:rounded-xl md:border md:p-4 md:bg-background">
        <Link href="https://grida.co" target="_blank">
          <GridaLogo />
        </Link>
        <SlashIcon className="opacity-50" />
        <Link href="/">
          <Logo className="h-3 w-auto" />
        </Link>
      </span>
      <div className="m-0 hidden md:flex gap-4 md:ml-10">
        <Link href="/playground">Playground</Link>
        <Link href="/pricing">Pricing</Link>
      </div>
      <div className="flex-1" />
      <div className="fixed bottom-0 left-0 p-5 flex h-48 w-full items-end justify-center bg-gradient-to-t from-black via-gray dark:from-black dark:via-black md:p-0 md:static md:h-auto md:w-auto md:bg-none">
        <div className="flex gap-4 items-center">
          <Link href="/get-started">
            <Button>Get Started</Button>
          </Link>

          <div style={{ width: 16 }} />
          <Link href="https://github.com/gridaco/cors.sh" target="_blank">
            <GitHubLogoIcon width={24} height={24} />
          </Link>
        </div>
      </div>
    </header>
  );
}
