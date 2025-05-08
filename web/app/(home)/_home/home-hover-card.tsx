"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus as dark,
  vs as light,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useMove } from "@use-gesture/react";
import { examples } from "@/k";
import { motion } from "motion/react";
import LineMotion from "@/components/motions/electron";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@workspace/ui/components/button";

function ThemedSyntaxHighlighter({
  children,
  language,
  forcedTheme,
}: {
  children: string;
  language: string;
  forcedTheme?: "dark" | "light";
}) {
  const { resolvedTheme } = useTheme();
  const theme = forcedTheme ?? resolvedTheme;
  const style = theme === "dark" ? dark : light;

  return (
    <SyntaxHighlighter
      customStyle={{
        width: "auto",
        background: "transparent",
        opacity: 0.8,
      }}
      language={language}
      style={style}
    >
      {children}
    </SyntaxHighlighter>
  );
}

export function HomeCardExample() {
  return (
    <motion.div
      style={{
        willChange: "transform",
      }}
      initial={{
        opacity: 0.0,
        transform:
          "perspective(1000px) translateY(40px) rotateX(0deg) rotateY(0deg)",
      }}
      animate={{
        opacity: 1,
        transform:
          "perspective(1000px) translateY(0) rotateX(5deg) rotateY(-5deg)",
      }}
      whileHover={{
        transform: "perspective(600px) rotateX(0deg) rotateY(0deg)",
      }}
      className="dark max-w-lg w-auto p-4 border border-border/10 rounded-xl flex flex-col gap-4 bg-card items-stretch shadow-[0_8px_50px_rgb(59,130,246,0.15)] dark:shadow-[0_8px_50px_rgb(59,130,246,0.1)] hover:shadow-[0_12px_60px_rgb(59,130,246,0.2)] dark:hover:shadow-[0_12px_60px_rgb(59,130,246,0.15)] transition-shadow duration-300"
    >
      <div className="relative flex mt-10 pl-8 pr-8 flex-row gap-2 justify-between select-none pointer-events-none">
        <div className="absolute inset-0 translate-y-1/2 ml-16 mr-16">
          <LineMotion />
        </div>
        <Image
          className="z-10"
          src="/assets/home-demo-0-illust-0-web.png"
          width={100}
          height={90}
          alt=""
        />
        <Image
          className="z-10"
          src="/assets/home-demo-0-illust-1-cloud.png"
          width={100}
          height={90}
          alt=""
        />
        <Image
          className="z-10"
          src="/assets/home-demo-0-illust-2-server.png"
          width={100}
          height={90}
          alt=""
        />
      </div>

      <div className="text-[10px] lg:text-xs rounded-lg overflow-scroll max-w-xs md:max-w-sm lg:max-w-2xl bg-muted border border-border/10">
        <ThemedSyntaxHighlighter language="typescript" forcedTheme="dark">
          {examples.fetch("https://example.com")}
        </ThemedSyntaxHighlighter>
      </div>
      <Link className="flex" href="/get-started">
        <Button className="bg-primary flex-1 text-sm font-semibold hover:opacity-90 transition-opacity">
          Get Started
        </Button>
      </Link>
    </motion.div>
  );
}

export function HomeHoverCardV2() {
  const [{ x, y }, set] = React.useState({ x: 0, y: 0 });

  const bind = useMove(({ movement: [mx, my], memo }) => {
    const el = document.getElementById("card");
    const rect = el!.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;

    const rotateX = ((-1 * (my - halfHeight)) / halfHeight) * 10; // 10 is rotation strength
    const rotateY = ((mx - halfWidth) / halfWidth) * 10; // 10 is rotation strength

    set({ x: rotateY, y: rotateX });

    return { x: mx, y: my };
  });

  const style = {
    transform: `perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`,
  };

  return (
    <div className="p-40" {...bind()}>
      {/* @ts-ignore */}
      <div
        id="card"
        className="w-[300px] h-[300px] flex items-center justify-center bg-card shadow-[0_8px_50px_rgb(59,130,246,0.15)] dark:shadow-[0_8px_50px_rgb(59,130,246,0.1)] hover:shadow-[0_12px_60px_rgb(59,130,246,0.2)] dark:hover:shadow-[0_12px_60px_rgb(59,130,246,0.15)] rounded-[15px] transition-all duration-100 will-change-transform"
        style={style}
      >
        <Image
          className="shadow-lg shadow-foreground/10"
          src="/tmp-asset-1.png"
          width={470}
          height={540}
          alt=""
        />
      </div>
    </div>
  );
}
