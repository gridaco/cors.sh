import React from "react";
import { PricingCardsList } from "../../layouts/pricing-card-list";
import { StepLayout } from "../../layouts/step-layout";

export default function GetstartedPage({ price }: { price: string }) {
  return (
    <StepLayout
      title="Get started"
      description="Ready to use cors.sh? select your plan and let’s create your first project."
      onNextClick={() => {}}
      nextPromptLabel="Next"
    >
      <PricingCardsList
        enableIndividualActions={false}
        initialSelection={price}
        onGetStartedClick={() => {}}
      />
    </StepLayout>
  );
}

export function getServersideProps(context: any) {
  const { price } = context.query;
  return {
    props: { price: price || "none" },
  };
}
