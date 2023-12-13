'use client'

import React, { useEffect } from "react";
import { TextFormField } from "@editor-ui/console";
import client from "@cors.sh/service-api";
import { useRouter } from "next/navigation";

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
    <main className="p-4 container mx-auto">
      <header className="mt-20 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">
          New Application
        </h1>
      </header>
      <form className="mt-20 flex flex-col gap-4 max-w-screen-sm" method="POST" action="/api/applications">
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
      </form>
    </main>
  );
}
