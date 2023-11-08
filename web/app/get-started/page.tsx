'use client'

import React, { useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import * as k from "@/k";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { MiniPlanSelect } from "@/components/pricing/mini";
import Link from "next/link";
import { motion } from "framer-motion";

// eslint-disable-next-line @next/next/no-async-client-component
export default function GetstartedPage() {
  const searchParams = useSearchParams()
  const _q_price = searchParams?.get("price") as string

  const validate_price_id = (price_id: string | undefined): boolean => {
    return price_id?.startsWith("price_") || false;
  };

  const _price = validate_price_id(_q_price)
    ? _q_price
    : k.plans.pro.id;


  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState(_price);
  const [allowedOrigins, setAllowedOrigins] = React.useState("");
  const [valid, setValid] = React.useState(false);
  const [isBusy, setIsBusy] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  const stateRef = useRef<string>(_price);

  stateRef.current = price;

  const router = useRouter();

  const onPriceChange = (price: string) => {
    setPrice(price);
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
      // log begin_checkout event
      const pricedata = (k.plans as any)[price];

      // @ts-ignore
      window.gtag?.("event", "begin_checkout", {
        value: pricedata.value,
        currency: pricedata.currency,
        items: [
          {
            item_id: pricedata.id,
            item_name: pricedata.label,
          },
        ],
      });
    } catch (e) { }

    try {
      // create onboarding application
      const form = {
        name: name ? name : undefined,
        allowedOrigins: allowedOrigins
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        priceId: price,
      };

      const application = await client.onboardingWithForm(form);

      const onboarding_id = application.id;

      // switch (stateRef.current) {
      //   case k.PRICE_FREE_MONTHLY: {
      //     // the free plan does not require payments, so we can skip to create new project right away.
      //     redirect =
      //       window.location.protocol + window.location.host + "/console/new";
      //     break;
      //   }
      // }

      // redirect user to payment page
      let params = new URLSearchParams();
      params.append("onboarding_id", onboarding_id);
      // TODO: multiple search params not supported by accounts.grida.co?redirect_uri=x

      const redirect = k.SERVER_URL + "/payments/checkout/new" + "?" + params;

      router.replace(redirect);
    } catch (e) {
      toast.error("Oops. something went wrong. please try again.");
      setIsBusy(false);
    }
  }, [price, name, allowedOrigins, router]);

  return (
    <FormPageLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <h1 className="text-3xl font-bold">Get started</h1>
        <p className="text-sm font-normal">
          Ready to use cors.sh? select your plan and let’s create your first
          project. <br />
        </p>
        <p className="text-xs font-normal opacity-50">*you can update the fields later</p>
      </div>
      <div className="form">
        <TextFormField
          label="Application name"
          autoFocus
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

        <motion.div
          style={{
            display: isValid ? "block" : "none",
          }}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={isValid ? "visible" : "hidden"}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <FormFieldBase style={{ width: "100%" }}>
            <div className="flex items-center justify-between self-stretch">
              <FormFieldLabel>Plan</FormFieldLabel>
              <Link className="underline text-xs" target="_blank" href="/pricing">View Pricing</Link>
            </div>
            <div style={{ flex: 1, alignSelf: "stretch" }}>
              <MiniPlanSelect
                onChange={(id) => {
                  onPriceChange(id);
                }}
                value={price}
                options={[
                  {
                    id: k.plans.pro.id,
                    label: <span>$3 / Mo<br />Annual Billing</span>,
                    content: <>Save 25% with annual billing</>
                  },
                  {
                    id: k.plans.pro2.id,
                    label: <span>$4 / Mo<br />Monthly Billing</span>,
                    content: <>-</>
                  }
                ]} />
            </div>
          </FormFieldBase>
        </motion.div>
        <div style={{ height: 16 }} />
        <Button
          color="white"
          disabled={!isValid || isBusy}
          onClick={onNextClick}
          height={"32px"}
        >
          Continue
        </Button>
      </div>
    </FormPageLayout >
  );
}