"use client";
import React from "react";
import styled from "@emotion/styled";
import { FaqItem } from "@/components/faq";
import { PricingCard } from "@/components/pricing";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FreeForOpensourceCard } from "@/components/free-for-opensource";
import { plans } from "@/k";
import faqs from "@/k/faq.json";
import Link from "next/link";


const price_size = {
  normal: { width: 280, height: 380 } as const,
  highlighted: { width: 300, height: 420 } as const,
} as const;

export default function Pricing() {
  const router = useRouter();


  return (
    <>
      <Main>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Get started with $3/Mo
        </motion.h1>
        <motion.section
          className="pricing-table section"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PricingCard
            style={price_size.normal}
            plan="Monthly Billing"
            price={{
              value: plans.pro.price.value,
              currency: plans.pro.price.symbol,
              unit: "/Mo",
            }}
            features={
              <>
                {
                  plans.pro.features.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))
                }
              </>
            }
            action={
              <Link href={`/get-started?price=${plans.pro.id}`}>
                <button>
                  Get Started
                </button>
              </Link>
            }
          />
          <PricingCard
            style={price_size.highlighted}
            plan="Annual Billing"
            price={{
              value: plans.pro2.price.value,
              currency: plans.pro2.price.symbol,
              unit: "/Mo",
            }}
            desc={"Save 25% with Annual Billing"}
            features={
              <>
                {
                  plans.pro2.features.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))
                }
              </>
            }
            action={
              <Link href={`/get-started?price=${plans.pro.id}`}>
                <button>
                  Get Started
                </button>
              </Link>
            }
          />
          <PricingCard
            style={price_size.normal}
            plan="Enterprise"
            desc="Annual billing only"
            price={{
              value: plans.enterprise.price.value,
              currency: plans.enterprise.price.symbol,
              unit: "/Year",
            }}
            features={
              <>
                {
                  plans.enterprise.features.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))
                }
              </>
            }
            action={
              <Link href={`/get-started?price=${plans.pro.id}`}>
                <button>
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
      </Main >
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
  margin-bottom: 80px;

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
