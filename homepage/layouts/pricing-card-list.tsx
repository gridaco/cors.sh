import React, { useState } from "react";
import { PricingCard } from "../components/pricing";
import * as k from "../k";
export function PricingCardsList({
  enableIndividualActions,
  onGetStartedClick,
  initialSelection,
  disableSelection = false,
}: {
  disableSelection?: boolean;
  initialSelection?: string;
  enableIndividualActions: boolean;
  onGetStartedClick: (id: string) => void;
}) {
  const [selected, setSelected] = useState(initialSelection);
  const onSelected = (id: string) => {
    if (disableSelection) return;
    setSelected(id);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 40,
      }}
    >
      {k.prices.map((price) => (
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
            onGetStartedClick(price.id);
          }}
        />
      ))}
    </div>
  );
}
