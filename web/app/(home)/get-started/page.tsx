"use client";

import React, { useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FormPageLayout,
  FormPageTitle,
  FormPageDescription,
  FormPageForm,
} from "@/components/layouts/form-page-layout";
import { validateUrls } from "@/utils/validate-urls";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import client from "@cors.sh/service-api";
import { useSearchParams } from "next/navigation";
import { MiniPlanSelect } from "@/components/pricing/mini";
import { motion } from "motion/react";
import { toast } from "sonner";
import Link from "next/link";
import * as k from "@/k";

export default function GetstartedPage() {
  return (
    <React.Suspense>
      <_Page />
    </React.Suspense>
  );
}

function _Page() {
  const searchParams = useSearchParams();
  const _q_price = searchParams?.get("price") as string;

  const validate_price_id = (price_id: string | undefined): boolean => {
    return price_id?.startsWith("price_") || false;
  };

  const _price = validate_price_id(_q_price) ? _q_price : k.plans.pro.id;

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
    } catch (e) {}

    try {
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

      let params = new URLSearchParams();
      params.append("onboarding_id", onboarding_id);
      const redirect = k.SERVER_URL + "/payments/checkout/new" + "?" + params;

      router.replace(redirect);
    } catch (e) {
      toast.error("Oops. something went wrong. please try again.");
      setIsBusy(false);
    }
  }, [price, name, allowedOrigins, router]);

  return (
    <FormPageLayout>
      <FormPageTitle className="text-3xl font-bold">Get started</FormPageTitle>
      <FormPageDescription className="text-sm text-muted-foreground font-normal">
        Ready to use cors.sh? select your plan and let's create your first
        project.
      </FormPageDescription>
      <FormPageDescription className="text-xs text-muted-foreground font-normal">
        *you can update the fields later
      </FormPageDescription>

      <FormPageForm>
        <div className="space-y-2">
          <Label htmlFor="name">Application name</Label>
          <Input
            id="name"
            autoFocus
            placeholder="my-portfolio-website"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="origins">Application origin URL</Label>
          <Input
            id="origins"
            placeholder="http://localhost:3000, https://my-site.com"
            value={allowedOrigins}
            onChange={(e) => setAllowedOrigins(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter()}
          />
          <p className="text-xs text-muted-foreground">
            Add up to 3 urls of your site
          </p>
        </div>

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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Plan</Label>
              <Link
                className="text-xs text-primary hover:underline"
                target="_blank"
                href="/pricing"
              >
                View Pricing
              </Link>
            </div>
            <MiniPlanSelect
              onChange={(id) => onPriceChange(id)}
              value={price}
              options={[
                {
                  id: k.plans.pro.id,
                  label: (
                    <span>
                      $3 / Mo
                      <br />
                      Annual Billing
                    </span>
                  ),
                  content: <>Save 25% with annual billing</>,
                },
                {
                  id: k.plans.pro2.id,
                  label: (
                    <span>
                      $4 / Mo
                      <br />
                      Monthly Billing
                    </span>
                  ),
                  content: <>-</>,
                },
              ]}
            />
          </div>
        </motion.div>

        <Button
          className="w-full"
          disabled={!isValid || isBusy}
          onClick={onNextClick}
        >
          Continue
        </Button>
      </FormPageForm>
    </FormPageLayout>
  );
}
