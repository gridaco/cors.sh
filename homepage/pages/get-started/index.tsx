import React, { useCallback, useRef } from "react";
import { PricingCardsList } from "../../layouts/pricing-card-list";
import { StepLayout } from "../../layouts/step-layout";
import * as k from "../../k";
import { useRouter } from "next/router";

export default function GetstartedPage({ price: _price }: { price: string }) {
  const [price, setPrice] = React.useState(_price);
  const stateRef = useRef<string>(_price);

  stateRef.current = price;

  const router = useRouter();

  const onPriceChange = (price: string) => {
    console.log("price change", price);
    setPrice(price);
  };
  console.log("price", price);

  const onNextClick = useCallback(() => {
    let redirect;
    switch (stateRef.current) {
      case k.PRICE_PAY_AS_YOU_GO: {
        // TODO: add stripe integration.
        redirect = "https://forms.gle/GXDGPAoM9fhZrQh77";
        break;
      }
      case k.PRICE_FREE_MONTHLY: {
        // the free plan does not require payments, so we can skip to create new project right away.
        redirect =
          window.location.protocol + window.location.host + "/console/new";
        break;
      }
      default: {
        redirect = k.SERVER_URL + "/payments/checkout-session?price=" + price;
        break;
      }
    }

    router.push("https://accounts.grida.co/signin?redirect_uri=" + redirect);
  }, [price]);

  return (
    <StepLayout
      title="Get started"
      description="Ready to use cors.sh? select your plan and let’s create your first project."
      onNextClick={onNextClick}
      nextPromptLabel="Sign in with Grida and continue"
    >
      <PricingCardsList
        onPriceChange={onPriceChange}
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
