import React, { useState } from "react";
import { PricingCard } from "../components/pricing";

interface Price {
  id: string;
  name: string;
  description?: string;
  price: string;
  unit?: string;
  features: string[];
}

const prices: Price[] = [
  {
    id: "free",
    name: "For Testing",
    price: "Free",
    features: [
      "10,000 requests per month",
      "5GB traffic per month",
      "100 requests per hour",
      "2 Projects",
      "3mb per request",
    ],
  },
  {
    id: "personal",
    name: "For Personal projects",
    price: "$4",
    unit: "Month",
    features: [
      "Up to 500,000 requests per month",
      "500GB Bandwidth",
      "Unlimited Projects",
      "No hourly request limit",
      "Max 6mb per request",
    ],
  },
  {
    id: "payg",
    name: "For Production projects",
    description: "From $39 / month",
    price: "Pay as you go",
    features: [
      "5,000,000 requests / month included",
      "Unlimited Bandwidth",
      "$1 per every next 100,000 requests",
      "Unlimited Projects",
      "No hourly request limit",
      "Max 6mb per request",
    ],
  },
];

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
      {prices.map((price) => (
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
