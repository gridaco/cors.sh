"use client";
import React, { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Cross2Icon } from "@radix-ui/react-icons";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { validateUrls } from "@/utils/validate-urls";
import {
  FormPageLayout,
  FormPageTitle,
  FormPageDescription,
  FormPageForm,
  FormPageCloseButton,
} from "@/components/layouts/form-page-layout";
import Head from "next/head";

export default function NewApplicationPage() {
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
        <FormPageCloseButton onClick={() => router.replace("/")}>
          <Cross2Icon className="h-4 w-4" />
        </FormPageCloseButton>
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
    if (valid) {
      onComplete();
    }
  };

  return (
    <>
      <FormPageTitle>
        Enter your API key from your inbox to get started
      </FormPageTitle>
      <FormPageForm>
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            placeholder="text_xxxx-xxxx-xxxx"
            value={tmpkey}
            onChange={(e) => {
              setTmpkey(e.target.value);
              onTypeKey(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onEnter();
              }
            }}
          />
        </div>
        <div className="h-4" />
        <Button disabled={!valid} onClick={onEnter}>
          Continue
        </Button>
      </FormPageForm>
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
  const [selectedPlan, setSelectedPlan] = React.useState("pro-monthly");

  const onEnter = () => {
    if (!isValid) {
      return;
    }
    setIsBusy(true);
    // TODO: Replace with your API client
    // client
    //   .createApplication({
    //     name: name,
    //     allowedOrigins: allowedOrigins
    //       .split(",")
    //       .map((origin) => origin.trim()),
    //   })
    //   .then((r) => {
    //     router.push(`/console/${r.id}`);
    //   })
    //   .finally(() => {
    //     setIsBusy(false);
    //   });
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
      <FormPageTitle>
        Now, Let&apos;s configure your first application
      </FormPageTitle>
      <FormPageForm>
        <div className="space-y-2">
          <Label htmlFor="app-name">Application name</Label>
          <Input
            id="app-name"
            placeholder="my-portfolio-website"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onEnter();
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="app-origin">Application origin URL</Label>
          <Input
            id="app-origin"
            placeholder="http://localhost:3000, https://my-site.com"
            value={allowedOrigins}
            onChange={(e) => setAllowedOrigins(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onEnter();
              }
            }}
          />
          <p className="text-sm text-muted-foreground">
            You can add up to 3 urls of your site
          </p>
        </div>

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
          className="space-y-2"
        >
          <Label htmlFor="plan">Plan</Label>
          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
            <SelectTrigger id="plan">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pro-monthly">Pro - $4/Mo</SelectItem>
              <SelectItem value="pro-yearly">
                Pro - $3/Mo (Pay annually, save $12)
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <div className="h-4" />
        <Button disabled={!isValid || isBusy} onClick={onEnter}>
          Continue
        </Button>
      </FormPageForm>
    </>
  );
}
