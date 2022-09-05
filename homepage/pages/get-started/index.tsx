import React from "react";
import { PricingCardsList } from "../../layouts/pricing-card-list";
import { StepLayout } from "../../layouts/step-layout";
import * as k from "../../k";
import { useRouter } from "next/router";

export default function GetstartedPage({ price: _price }: { price: string }) {
  const [price, setPrice] = React.useState(_price);

  const router = useRouter();

  return (
    <StepLayout
      title="Get started"
      description="Ready to use cors.sh? select your plan and let’s create your first project."
      onNextClick={() => {
        // NOTE: reported problem - the price is not being set on production build.
        const redirect =
          k.SERVER_URL + "/payments/checkout-session?price=" + price;

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
  const { price } = context.query;

  const validate_price_id = (price_id: string | undefined): boolean => {
    return price_id?.startsWith("price_") || false;
  };

  const _price = validate_price_id(price)
    ? price
    : k.PRICE_PERSONAL_PRO_MONTHLY;

  return {
    props: {
      price: _price,
    },
  };
}
