'use client'
import React, { useEffect } from "react";
import {
  Button,
  FormFieldBase,
  FormFieldLabel,
  TextFormField,
} from "@editor-ui/console";
import Select from "react-select";
import client from "@cors.sh/service-api";
import { redirect, useRouter } from "next/navigation";
import { Cross2Icon } from "@radix-ui/react-icons";
import Head from "next/head";
import { FormPageLayout } from "@app/ui/layouts";
import { validateUrls } from "@app/ui/utils";
import { motion } from "framer-motion";

export default function NewApplicationPage() {
  redirect("/")
  const router = useRouter();
  const [step, setStep] = React.useState<"signin" | "setup">("signin");

  function Body() {
    switch (step) {
      case "signin":
        return (
          <SigninForm
            onComplete={() => {
              setStep("setup");
            }}
          />
        );
      case "setup":
        return <SetupForm />;
    }
  }

  return (
    <>
      <Head>
        <title>CORS.SH - First App</title>
      </Head>
      <FormPageLayout>
        <button
          className="close"
          onClick={() => {
            router.replace("/");
          }}
        >
          <Cross2Icon />
        </button>
        <Body />
      </FormPageLayout>
    </>
  );
}

function SigninForm({ onComplete }: { onComplete: () => void }) {
  const [tmpkey, setTmpkey] = React.useState("");
  const [valid, setValid] = React.useState(false);

  const onTypeKey = (key: string) => {
    // todo: validate key via api
    setValid(key.length > 10);
  };

  const onEnter = () => {
    // this is required because onEnter can also be invoked from input's callback
    if (valid) {
      onComplete();
    }
  };

  return (
    <>
      <h1>Enter your API key from your inbox to get started</h1>
      <div className="form">
        <TextFormField
          label="API Key"
          placeholder="text_xxxx-xxxx-xxxx"
          onEnter={onEnter}
          onChange={onTypeKey}
        />
      </div>
      <div style={{ height: 16 }} />
      <Button disabled={!valid} onClick={onEnter} height={"32px"}>
        Continue
      </Button>
    </>
  );
}

function SetupForm() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [allowedOrigins, setAllowedOrigins] = React.useState("");
  const [isBusy, setIsBusy] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  const [isPricingVisible, setIsPricingVisible] = React.useState(false);

  const onEnter = () => {
    if (!isValid) {
      return;
    }
    setIsBusy(true);
    client
      .createApplication({
        name: name,
        allowedOrigins: allowedOrigins
          .split(",")
          .map((origin) => origin.trim()),
      })
      .then((r) => {
        router.push(`/console/${r.id}`,);
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  useEffect(() => {
    setIsValid(name.length > 0 && validateUrls(allowedOrigins));
  }, [name, allowedOrigins]);

  useEffect(() => {
    if (isValid) {
      setTimeout(() => {
        setIsPricingVisible(true);
      }, 1800);
    }
  }, [isValid]);

  return (
    <>
      <h1>Now, Let&apos;s configure your first application</h1>
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
          helpText="You can add up to 3 urls of your site"
          onEnter={onEnter}
          onChange={setAllowedOrigins}
        />
        {/* pricing plan select */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={
            isPricingVisible
              ? {
                opacity: 1,
                y: 0,
              }
              : {}
          }
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <FormFieldBase style={{ width: "100%" }}>
            <FormFieldLabel>Plan</FormFieldLabel>
            <div style={{ flex: 1, alignSelf: "stretch" }}>
              <Select
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onEnter();
                  }
                }}
                options={[
                  { value: "pro-monthly", label: "Pro - $4/Mo" },
                  {
                    value: "pro-yearly",
                    label: "Pro - $3/Mo (Pay annualy, save $12)",
                  },
                ]}
                defaultValue={{ value: "pro", label: "Pro - $4/Mo" }}
              />
            </div>
          </FormFieldBase>
        </motion.div>
        <div style={{ height: 16 }} />
        <Button disabled={!isValid || isBusy} onClick={onEnter} height={"32px"}>
          Continue
        </Button>
      </div>
    </>
  );
}
