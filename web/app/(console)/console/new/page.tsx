"use client";

import React, { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import client from "@cors.sh/service-api";
import { useRouter } from "next/navigation";
import {
  FormPageLayout,
  FormPageTitle,
  FormPageForm,
} from "@/components/layouts/form-page-layout";
import { validateUrls } from "@/utils/validate-urls";

export default function NewApplicationPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [allowedOrigins, setAllowedOrigins] = React.useState("");
  const [isBusy, setIsBusy] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);

  const onCreateNewClick = () => {
    setIsBusy(true);
    client
      .createApplication({
        name: name,
        allowedOrigins: allowedOrigins
          .split(",")
          .map((origin) => origin.trim()),
      })
      .then((r) => {
        router.push(`/console/${r.id}`);
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  useEffect(() => {
    setIsValid(name.length > 0 && validateUrls(allowedOrigins));
  }, [name, allowedOrigins]);

  return (
    <FormPageLayout>
      <FormPageTitle>Create new application</FormPageTitle>
      <FormPageForm>
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            placeholder="my-portfolio-website"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="origins">Your site</Label>
          <Input
            id="origins"
            placeholder="http://localhost:3000, https://my-site.com"
            value={allowedOrigins}
            onChange={(e) => setAllowedOrigins(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            You can add up to 3 urls of your site
          </p>
        </div>

        <div className="h-4" />
        <Button
          className="w-full"
          disabled={!isValid || isBusy}
          onClick={onCreateNewClick}
        >
          Create Project
        </Button>
      </FormPageForm>
    </FormPageLayout>
  );
}
