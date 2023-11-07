import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

export function PricingCard({
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
    <PricingCardWrapper style={style} whileHover={{ scale: 1.02 }}>
      <span className="plan">{plan}</span>
      <section>
        <span className="price">
          <span className="a">
            {typeof price.value === "string"
              ? price.value
              : `${price.currency}${price.value}`}
          </span>
          <span className="b">{price.unit}</span>
        </span>
        {desc && (
          <span className="unit">
            <span className="b">{desc}</span>
          </span>
        )}
      </section>
      <section>
        <span className="desc">{features}</span>
      </section>
      <div style={{ minHeight: 20, flex: 1 }} />
      {action}
      <span className="dot" />
    </PricingCardWrapper>
  );
}

const PricingCardWrapper = styled(motion.div)`
  --card-border-rgb: 200, 200, 200;

  display: flex;
  flex-direction: column;
  padding: 20px;
  border: solid 2px rgba(var(--card-border-rgb), 0.1);
  border-radius: 8px;
  position: relative;

  font-family: Inter, sans-serif;
  text-align: left;

  &:hover {
    border: solid 2px rgba(var(--card-border-rgb), 0.2);
    box-shadow: 0px 0px 24px 2px rgba(var(--card-box-shadow-rgb), 0.1);
  }

  section {
    margin-top: 32px;
  }

  .plan {
    font-size: 14px;
    font-weight: 500;
  }

  .price {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
    flex: none;
    gap: 2px;
    box-sizing: border-box;

    .a {
      font-size: 32px;
      font-weight: 800;
    }

    .b {
      font-size: 13px;
      font-weight: 500;
      opacity: 0.5;
    }
  }

  .unit {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
    flex: none;
    gap: 4px;
    box-sizing: border-box;
    opacity: 0.8;

    .b {
      font-size: 13px;
      font-weight: 500;
      opacity: 0.5;
    }
  }

  .desc {
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    opacity: 0.5;
  }

  button {
    box-shadow: 0px 4px 24px 2px rgba(var(--card-box-shadow-rgb), 0.2);
    background: var(--card-button-background);
    border: solid 1px rgba(120, 120, 120, 0.8);
    border-radius: 4px;
    padding: 8px 10px;
    font-size: 12px;
    font-weight: 600;
    outline: none;
    cursor: pointer;
    color: rgb(var(--foreground-inverted-rgb));

    :hover {
      opacity: 0.8;
    }

    :disabled {
      opacity: 0.5;
    }

    :active {
      opacity: 1;
    }

    :focus {
    }
  }

  .dot {
    width: 8px;
    height: 8px;
    background-color: rgb(var(--foreground-rgb));
    border-radius: 50%;
    position: absolute;
    top: 20px;
    right: 20px;
  }
`;
