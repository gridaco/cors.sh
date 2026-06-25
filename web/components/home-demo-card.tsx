"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import LineMotion from "@/components/motions/electron";
import { Button } from "@workspace/ui/components/button";

const CODE = `fetch("https://proxy.cors.sh/" + url, {
  headers: {
    "x-cors-api-key": "live_••••",
  },
});`;

/**
 * The bespoke hero "demo" — web → cloud → server illustrations wired together
 * by the animated LineMotion connector, a code sample, and a CTA, all on a
 * 3D-tilted dark card that flattens on hover. (Recovered from the original
 * landing page and adapted to the current design system.)
 */
export function HomeDemoCard() {
  return (
    <motion.div
      style={{ willChange: "transform" }}
      initial={{
        opacity: 0,
        transform:
          "perspective(1000px) translateY(40px) rotateX(0deg) rotateY(0deg)",
      }}
      animate={{
        opacity: 1,
        transform:
          "perspective(1000px) translateY(0) rotateX(5deg) rotateY(-5deg)",
      }}
      whileHover={{ transform: "perspective(600px) rotateX(0deg) rotateY(0deg)" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-[0_8px_50px_rgba(59,130,246,0.18)] transition-shadow duration-300 hover:shadow-[0_12px_60px_rgba(59,130,246,0.28)]"
    >
      <div className="pointer-events-none relative mt-6 flex select-none flex-row items-center justify-between gap-2 px-6">
        <div className="absolute inset-x-14 top-1/2 -translate-y-1/2">
          <LineMotion />
        </div>
        <Image
          className="z-10 invert dark:invert-0"
          src="/assets/home-demo-0-illust-0-web.png"
          width={96}
          height={86}
          alt="Your website"
        />
        <Image
          className="z-10 invert dark:invert-0"
          src="/assets/home-demo-0-illust-1-cloud.png"
          width={96}
          height={86}
          alt="CORS.SH proxy"
        />
        <Image
          className="z-10 invert dark:invert-0"
          src="/assets/home-demo-0-illust-2-server.png"
          width={96}
          height={86}
          alt="Any API"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-muted/60 p-3">
        <pre className="text-[11px] leading-relaxed">
          <code className="font-mono text-foreground/90">{CODE}</code>
        </pre>
      </div>

      <Button asChild className="h-9 w-full text-sm">
        <Link href="/console/new">
          Get started <ArrowRight className="size-4" />
        </Link>
      </Button>
    </motion.div>
  );
}
