"use client";
import React from "react";
import styled from "@emotion/styled";
import { FaqItem } from "@/components/faq";
import { PricingCard } from "@/components/pricing";
import { motion } from "framer-motion";
import faqs from "@/k/faq.json";
import plans_live from "@/k/plans.json";
import plans_test from "@/k/plans.test.json";
import { useRouter } from "next/navigation";
import { FreeForOpensourceCard } from "@/components/free-for-opensource";

const plans = process.env.NODE_ENV === "production" ? plans_live : plans_test;

const price_size = {
  normal: { width: 220, height: 340 } as const,
  highlighted: { width: 234, height: 380 } as const,
} as const;

export default function Pricing() {
  const router = useRouter();

  const onUpgradeClick = (price: string) => {
    // POST
    router.push(`/checkout/sessions?price=${price}`);
  };

  return (
    <>
      <Main>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Choose your plan
        </motion.h1>
        <motion.section
          className="pricing-table section"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PricingCard
            style={price_size.normal}
            plan="Personal"
            price={{
              value: plans.personal.price.value,
              currency: plans.personal.price.symbol,
              unit: "/Mo",
            }}
            desc={"Billed annually or $25 month-to-moth"}
            features={
              <>
                <li>Single Seat</li>
                <li>4K Resolution</li>
                <li>Royalty-free License</li>
              </>
            }
            action={
              <button
                onClick={() => {
                  onUpgradeClick(plans.personal.id);
                }}
              >
                Get Started
              </button>
            }
          />
          <PricingCard
            style={price_size.highlighted}
            plan="Team"
            price={{
              value: plans.team.price.value,
              currency: plans.team.price.symbol,
              unit: "/Mo",
            }}
            desc={"Annual billing only"}
            features={
              <>
                <li>Unlimited Seats</li>
                <li>4K Resolution</li>
                <li>Royalty-free License</li>
                <li>Access Blender Files</li>
              </>
            }
            action={
              <button
                onClick={() => {
                  onUpgradeClick(plans.team.id);
                }}
              >
                Get Started
              </button>
            }
          />
          <PricingCard
            style={price_size.normal}
            plan="Studio"
            desc="Annual billing only"
            price={{
              value: plans.studio.price.value,
              currency: plans.studio.price.symbol,
              unit: "/Mo",
            }}
            features={
              <>
                <li>Extended Studio License</li>
                <li>8K Resolution</li>
                <li>Access Blender Files</li>
              </>
            }
            action={
              <button
                onClick={() => {
                  onUpgradeClick(plans.studio.id);
                }}
              >
                Get Started
              </button>
            }
          />
        </motion.section>
        <motion.hr
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
        />
        <motion.section
          className="faq section"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            FAQ
          </motion.h2>
          <motion.div
            className="list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {faqs.map((_: any, i: number) => (
              <FaqItem key={i} {..._} />
            ))}
          </motion.div>
        </motion.section>
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;

  font-family: "Inter", sans-serif;

  margin-top: 80px;

  h1 {
    margin-top: 80px;
    font-size: 48px;
    font-weight: 700;
    text-align: center;
  }

  h2 {
    margin-top: 32px;
    text-align: center;
  }

  .pricing-table {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
  }

  hr {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 32px;
    margin-bottom: 32px;
  }

  section.section {
    padding: 32px;
  }

  section.faq {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 32px;
    width: 670px;

    .list {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }
  }
`;
