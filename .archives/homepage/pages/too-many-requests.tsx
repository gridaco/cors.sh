import React from "react";
import { PricingCardsList } from "../layouts/pricing-card-list";
import { StepLayout } from "../layouts/step-layout";
import * as k from "../k";
export default function TooMayRequestsPage() {
  return (
    <div>
      <StepLayout
        title="Oops. Too many requests."
        description="We’re sorry to tell you that you’ve reached your hourly request limit for free-tier.
Upgrade your plan to remove this limit."
        onNextClick={() => {}}
        nextPromptLabel="Sign in with Grida and continue"
      >
        <PricingCardsList
          enableIndividualActions={false}
          // fallback to personal plan
          initialSelection={k.PRICE_PERSONAL_PRO_MONTHLY}
          onGetStartedClick={() => {}}
        />
      </StepLayout>
    </div>
  );
}
