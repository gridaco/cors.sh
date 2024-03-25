'use client'

import React, { useEffect } from "react";
import { TextFormField } from "@editor-ui/console";
import client from "@cors.sh/service-api";
import { useRouter } from "next/navigation";
import { Form, FormFooter, FormHeader, FormRow, Button } from "@/console";

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
        router.push(`/console/${r.id}`,);
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  useEffect(() => {
    setIsValid(name.length > 0 && validateUrls(allowedOrigins));
  }, [name, allowedOrigins]);

  return (
    <main className="p-10 container mx-auto">
      <CreateApplicationForm />
      {/* <form method="POST" action="/api/applications">
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
        <button
          className="rounded px-4 py-3 cursor-pointer bg-black text-white dark:bg-white dark:text-black"
          disabled={!isValid || isBusy}
          onClick={onCreateNewClick}
        >
          Create Project
        </button>
      </form> */}
    </main>
  );
}

function CreateApplicationForm() {
  return (
    <Form>
      <FormHeader >
        <h1 className="text-md font-medium">
          Create a new application
        </h1>
        <p className="mt-4 text-sm opacity-50">
          Your project will have its own dedicated instance and full postgres database.
          <br />
          An API will be set up so you can easily interact with your new database.
        </p>
      </FormHeader>
      <FormRow label="Name">
        <TextFormField
          placeholder="my-portfolio-website"
        />
      </FormRow>
      <FormRow label="Whitelist Origins" noborder>
        <TextFormField
          placeholder="http://localhost:3000, https://my-site.com"
          helpText="Register URLs where the api will be originated from. Use comma to separate."
        />
      </FormRow>
      <FormFooter >
        <Button variant="secondary">
          Cancel
        </Button>
        <div className="flex items-center gap-4">
          <p className="text-xs opacity-50">You can rename your project later</p>
          <Button>
            Create Project
          </Button>
        </div>
      </FormFooter>
    </Form>
  )
}
