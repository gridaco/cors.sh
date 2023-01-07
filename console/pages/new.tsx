import React, { useEffect } from "react";
import { Button, TextFormField } from "@editor-ui/console";
import client from "@cors.sh/service-api";
import { useRouter } from "next/router";
import { FormPageLayout } from "@app/ui/layouts";
export default function NewApplicationPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [allowedOrigins, setAllowedOrigins] = React.useState("");
  const [isBusy, setIsBusy] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);

  const validateUrls = (urls: string) => {
    const lines = urls.split(",").map((line) => line.trim());
    for (const line of lines) {
      try {
        new URL(line);
      } catch (e) {
        return false;
      }
    }
    return true;
  };

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
        router.push({
          pathname: "[id]",
          query: { id: r.id },
        });
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
      <h1>Create new application</h1>
      <div className="form">
        <TextFormField
          label="Project Name"
          placeholder="my-portfolio-website"
          onChange={setName}
        />
        <TextFormField
          label="Your site"
          placeholder="http://localhost:3000, https://my-site.com"
          helpText="You can add up to 3 urls of your site"
          onChange={setAllowedOrigins}
        />
        <div style={{ height: 16 }} />
        <Button
          disabled={!isValid || isBusy}
          onClick={onCreateNewClick}
          height={"32px"}
        >
          Create Project
        </Button>
      </div>
    </FormPageLayout>
  );
}
