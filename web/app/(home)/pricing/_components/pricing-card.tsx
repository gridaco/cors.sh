import React from "react";
import { motion } from "motion/react";

export default function PricingCard({
  plan,
  price,
  desc,
  features,
  action,
  style = {},
}: {
  plan: string;
  price: {
    value: number | string;
    currency?: string;
    unit?: string;
  };
  desc?: string;
  features: React.ReactNode;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      style={style}
      whileHover={{ scale: 1.02 }}
      className="flex flex-col p-5 border-2 border-border/10 rounded-lg relative font-sans text-left hover:border-border/20 hover:shadow-[0px_0px_24px_2px_rgba(var(--card-box-shadow-rgb),0.1)]"
    >
      <span className="text-sm font-medium">{plan}</span>

      <section className="mt-8">
        <div className="flex flex-row items-center gap-0.5">
          <span className="text-3xl font-extrabold">
            {typeof price.value === "string"
              ? price.value
              : `${price.currency}${price.value}`}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {price.unit}
          </span>
        </div>
        {desc && (
          <div className="flex flex-row items-center gap-1 opacity-80">
            <span className="text-sm font-medium text-muted-foreground">
              {desc}
            </span>
          </div>
        )}
      </section>

      <section className="mt-8">
        <span className="font-medium opacity-80">{features}</span>
      </section>

      <div className="min-h-5 flex-1" />
      <div className="self-start">{action}</div>

      <span className="w-2 h-2 bg-foreground rounded-full absolute top-5 right-5" />
    </motion.div>
  );
}
