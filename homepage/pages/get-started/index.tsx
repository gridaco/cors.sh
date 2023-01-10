import React, { useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { FormPageLayout } from "@app/ui/layouts";
import { validateUrls } from "@app/ui/utils";
import {
  Button,
  FormFieldBase,
  FormFieldLabel,
  TextFormField,
} from "@editor-ui/console";
import Select from "react-select";
import client from "@cors.sh/service-api";
import * as k from "../../k";
import { toast } from "react-toastify";

export default function GetstartedPage({ price: _price }: { price: string }) {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState(_price);
  const [allowedOrigins, setAllowedOrigins] = React.useState("");
  const [valid, setValid] = React.useState(false);
  const [isBusy, setIsBusy] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  const stateRef = useRef<string>(_price);

  stateRef.current = price;

  const router = useRouter();

  const pricing_options = Object.values(pricing);

  const onPriceChange = (price: string) => {
    console.log("price change", price);
    setPrice(price);
  };

  const onTypeKey = (key: string) => {
    // todo: validate key via api
    setValid(key.length > 10);
  };

  const onEnter = () => {
    // this is required because onEnter can also be invoked from input's callback
    if (valid) {
      onNextClick();
    }
  };

  useEffect(() => {
    setIsValid(name.length > 0 && validateUrls(allowedOrigins));
  }, [name, allowedOrigins]);

  const onNextClick = useCallback(async () => {
    setIsBusy(true);

    try {
      // create onboarding application
      const application = await client.onboardingWithForm({
        name: name ? name : undefined,
        allowedOrigins: allowedOrigins
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        priceId: price,
      });

      const onboarding_id = application.id;

      // redirect user to payment page
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
          let params = new URLSearchParams();
          params.append("onboarding_id", onboarding_id);
          // TODO: multiple search params not supported by accounts.grida.co?redirect_uri=x

          redirect = k.SERVER_URL + "/payments/checkout/new" + "?" + params;

          break;
        }
      }

      router.replace(redirect);
    } catch (e) {
      toast("Oops. something went wrong. please try again.", { type: "error" });
      setIsBusy(false);
    }
  }, [price]);

  return (
    <FormPageLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <h1>Get started</h1>
        <p>
          Ready to use cors.sh? select your plan and let’s create your first
          project. <br />
        </p>
        <p style={{ opacity: 0.5 }}>you can change this later</p>
      </div>
      <div className="form">
        <TextFormField
          label="Application name"
          placeholder="my-portfolio-website"
          onEnter={onEnter}
          onChange={setName}
        />
        <TextFormField
          label="Application origin URL"
          placeholder="http://localhost:3000, https://my-site.com"
          helpText="Add up to 3 urls of your site"
          onEnter={onEnter}
          onChange={setAllowedOrigins}
        />
        {/* pricing plan select */}

        <FormFieldBase style={{ width: "100%" }}>
          <FormFieldLabel>Plan</FormFieldLabel>
          <div style={{ flex: 1, alignSelf: "stretch" }}>
            <Select
              id="pricing-select"
              instanceId="pricing-select"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onEnter();
                }
              }}
              //
              onChange={(e) => {
                e && onPriceChange(e.value);
              }}
              value={pricing[price]}
              options={pricing_options}
            />
          </div>
        </FormFieldBase>
        <div style={{ height: 16 }} />
        <Button
          disabled={!isValid || isBusy}
          onClick={onNextClick}
          height={"32px"}
        >
          Sign in with Grida and Continue
        </Button>
      </div>
    </FormPageLayout>

    // <StepLayout
    //   title="Get started"
    //   description="Ready to use cors.sh? select your plan and let’s create your first project."
    //   onNextClick={onNextClick}
    //   nextPromptLabel="Sign in with Grida and continue"
    // >
    //   <PricingCardsList
    //     onPriceChange={onPriceChange}
    //     initialSelection={price}
    //   />
    // </StepLayout>
  );
}

const pricing = {
  [k.PRICE_PERSONAL_PRO_MONTHLY]: {
    value: k.PRICE_PERSONAL_PRO_MONTHLY,
    label: "Pro - $4/Mo",
  },
  [k.PRICE_PERSONAL_PRO_YEARLY]: {
    value: k.PRICE_PERSONAL_PRO_YEARLY,
    label: "Pro - $3/Mo (Pay annualy, save $12)",
  },
  [k.PRICE_ENTERPRISE_PRO_YEARLY]: {
    value: k.PRICE_ENTERPRISE_PRO_YEARLY,
    label: "Enterprise - $499/Yr",
  },
  // [k.PRICE_FREE_MONTHLY]: {
  //   value: k.PRICE_FREE_MONTHLY,
  //   label: "Free",
  // },
  // [k.PRICE_PAY_AS_YOU_GO]: {},
} as const;

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
