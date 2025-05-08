import React from "react";
import { ApplicationWithApiKey } from "@cors.sh/service-api";
import {
  FormPageLayout,
  FormPageForm,
  FormPageCloseButton,
} from "@/components/layouts/form-page-layout";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Logo } from "@/components/logo";
import { ApiKeyReveal } from "@/components/api-key-reveal";
import { EditableTitle } from "./_components/title";

type Params = {
  id: string;
};

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const application: ApplicationWithApiKey = {
    id: id,
    name: "my-portfolio-website",
    apikey_live: "prod_1223-xasx-xxe2",
    apikey_test: "test_xxasdj-xxd9-x2hx",
    allowedOrigins: [],
  };

  return (
    <FormPageLayout>
      <FormPageCloseButton />
      <Logo />
      <div className="h-20" />
      <EditableTitle initialValue={application.name} />
      <FormPageForm>
        <ApiKeyReveal
          keys={{
            test: application.apikey_test,
            prod: application.apikey_live,
          }}
        />

        <div className="space-y-2">
          <Label htmlFor="origins">Application origin URL</Label>
          <Input
            id="origins"
            readOnly
            placeholder="http://localhost:3000, https://my-site.com"
            value={application.allowedOrigins?.join(", ")}
          />
          <p className="text-xs text-muted-foreground">
            You can add up to 3 urls of your site
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targets">Restrict Targets (Optional)</Label>
          <Input
            id="targets"
            readOnly
            placeholder="http://localhost:3000, https://my-site.com"
            value={application.allowedOrigins?.join(", ")}
          />
          <p className="text-xs text-muted-foreground">
            You can restrict target urls for extra security
          </p>
        </div>

        <Button className="w-full">Save</Button>
        <Button variant="link">Archive application</Button>
      </FormPageForm>
    </FormPageLayout>
  );
}
