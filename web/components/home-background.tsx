"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";

/**
 * Animated hero backdrop — the bespoke `background.svg` line-art, faded in with
 * a gentle scale, softened by an edge vignette that blends into the page bg.
 */
export function HomeBackground() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50 select-none"
      transition={{ delay: 0.2, duration: 2, ease: "easeOut" }}
      initial={{ opacity: 0.1, scale: 1.3 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="absolute inset-0">
        <Image
          src="/assets/background.svg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.35] invert dark:opacity-50 dark:invert-0"
        />
      </div>
      <VignettingOverlay w={220} />
    </motion.div>
  );
}

function VignettingOverlay({ w }: { w: number }) {
  return (
    <div className="absolute inset-0">
      <div
        style={{ height: w }}
        className="absolute inset-x-0 top-0 bg-gradient-to-b from-background via-transparent to-transparent"
      />
      <div
        style={{ height: w }}
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-transparent to-transparent"
      />
      <div
        style={{ width: w }}
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-background via-transparent to-transparent"
      />
      <div
        style={{ width: w }}
        className="absolute inset-y-0 right-0 bg-gradient-to-l from-background via-transparent to-transparent"
      />
    </div>
  );
}
