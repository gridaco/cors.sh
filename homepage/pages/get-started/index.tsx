import React from "react";
import { PricingCardsList } from "../../layouts/pricing-card-list";
import { StepLayout } from "../../layouts/step-layout";
import * as k from "../../k";
import { useRouter } from "next/router";

export default function GetstartedPage({ price: _price }: { price?: string }) {
  const [price, setPrice] = React.useState(
    _price || k.PRICE_PERSONAL_PRO_MONTHLY
  );

  const router = useRouter();
  return (
    <StepLayout
      title="Get started"
      description="Ready to use cors.sh? select your plan and let’s create your first project."
      onNextClick={() => {
        //
        const redirect =
          k.SERVER_URL +
          "/payments/checkout-session?price=" +
          (price ||
            // ensure again to include price (fallback)
            k.PRICE_PERSONAL_PRO_MONTHLY);

        router.push(
          "https://accounts.grida.co/signin?redirect_uri=" + redirect
        );
      }}
      nextPromptLabel="Sign in with Grida and continue"
    >
      <PricingCardsList
        onPriceChange={setPrice}
        enableIndividualActions={false}
        // fallback to personal plan
        initialSelection={price}
      />
    </StepLayout>
  );
}

export async function getServerSideProps(context: any) {
  // do auth here?

  const { price } = context.query;
  return {
    props: { price: price || null },
  };
}
