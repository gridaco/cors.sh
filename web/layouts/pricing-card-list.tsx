'use client'

import React, { useState } from "react";
import { PricingCard } from "@/components/price-card";
import * as k from "@/k";

export function PricingCardsList({
  enableIndividualActions,
  onGetStartedClick,
  initialSelection,
  onPriceChange,
  disableSelection = false,
}: {
  disableSelection?: boolean;
  initialSelection?: string;
  enableIndividualActions: boolean;
  onPriceChange?: (price: string) => void;
  onGetStartedClick?: (id: string) => void;
}) {
  const [selected, setSelected] = useState(initialSelection);
  const onSelected = (id: string) => {
    if (disableSelection) return;
    setSelected(id);
    onPriceChange?.(id);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: 40,
      }}
    >
      {k.prices.map((price, i) => (
        <div key={i}>
          <PricingCard
            onClick={() => onSelected(price.id)}
            selected={selected === price.id}
            key={price.id}
            name={price.name}
            description={price.description}
            price={price.price}
            startLabel="Get Started"
            unit={price.unit}
            features={price.features}
            enableAction={enableIndividualActions}
            onStartClick={() => {
              onGetStartedClick?.(price.id);
            }}
          />
        </div>

      ))}
    </div>
  );
}
