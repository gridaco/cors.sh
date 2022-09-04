import React from "react";
import { PricingCardsList } from "../../layouts/pricing-card-list";
import { StepLayout } from "../../layouts/step-layout";
import * as k from "../../k";
import { useRouter } from "next/router";

export default function GetstartedPage({ price }: { price: string }) {
  const router = useRouter();
  return (
    <StepLayout
      title="Get started"
      description="Ready to use cors.sh? select your plan and let’s create your first project."
      onNextClick={() => {}}
      nextPromptLabel="Sign in with Grida and continue"
    >
      <PricingCardsList
        enableIndividualActions={false}
        // fallback to personal plan
        initialSelection={price || k.PRICE_PERSONAL_PRO_MONTHLY}
        onGetStartedClick={() => {
          const redirect =
            k.SERVER_URL + "/payments/create-checkout-session?price=" + price;

          router.push(
            "https://accounts.grida.co/signin?redirect_uri=" + redirect
          );
        }}
      />
    </StepLayout>
  );
}

export async function getServerSideProps(context: any) {
  const { price } = context.query;
  return {
    props: { price: price || null },
  };
}
