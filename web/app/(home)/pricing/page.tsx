"use client";
import React from "react";
import { motion } from "motion/react";
import { plans } from "@/k";
import PricingCard from "./_components/pricing-card";
import FreeForOpensourceCard from "./_components/free-for-opensource-card";
import faqs from "@/k/faq.json";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

const PRICE_SIZES = {
  normal: { width: 280, height: 380 },
  highlighted: { width: 300, height: 420 },
} as const;

export default function Pricing() {
  return (
    <main className="flex flex-col items-center min-h-screen font-sans mt-20 mb-20">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-20 text-5xl font-bold text-center"
      >
        Get started with $3/Mo
      </motion.h1>

      <motion.section
        className="flex flex-row justify-center items-center gap-4 mt-8 p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PricingCard
          style={PRICE_SIZES.normal}
          plan="Monthly Billing"
          price={{
            value: plans.pro.price.value,
            currency: plans.pro.price.symbol,
            unit: "/Mo",
          }}
          features={
            <ul className="space-y-2">
              {plans.pro.features.map((feature, i) => (
                <li key={i} className="text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          }
          action={
            <Link href={`/get-started?price=${plans.pro.id}`}>
              <button className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </Link>
          }
        />

        <PricingCard
          style={PRICE_SIZES.highlighted}
          plan="Annual Billing"
          price={{
            value: plans.pro2.price.value,
            currency: plans.pro2.price.symbol,
            unit: "/Mo",
          }}
          desc="Save 25% with Annual Billing"
          features={
            <ul className="space-y-2">
              {plans.pro2.features.map((feature, i) => (
                <li key={i} className="text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          }
          action={
            <Link href={`/get-started?price=${plans.pro.id}`}>
              <button className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </Link>
          }
        />

        <PricingCard
          style={PRICE_SIZES.normal}
          plan="Enterprise"
          desc="Annual billing only"
          price={{
            value: plans.enterprise.price.value,
            currency: plans.enterprise.price.symbol,
            unit: "/Year",
          }}
          features={
            <ul className="space-y-2">
              {plans.enterprise.features.map((feature, i) => (
                <li key={i} className="text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          }
          action={
            <Link href={`/get-started?price=${plans.pro.id}`}>
              <button className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </Link>
          }
        />
      </motion.section>

      <motion.hr
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full border border-border/10 my-8"
      />

      <motion.div
        id="free"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <FreeForOpensourceCard />
      </motion.div>

      <motion.hr
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full border border-border/10 my-8"
      />

      <motion.section
        className="flex flex-col items-stretch gap-8 w-[670px] p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-center text-2xl font-semibold"
        >
          FAQ
        </motion.h2>

        <motion.div
          className="flex flex-col items-stretch gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Accordion type="multiple" className="w-full space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </motion.section>
    </main>
  );
}
