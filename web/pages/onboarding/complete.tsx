import React from "react";
import { Client, ApplicationWithApiKey } from "@cors.sh/service-api";
import {
  FormPageLayout,
  FormPageTitle,
  FormPageDescription,
  FormPageForm,
} from "@/components/layouts/form-page-layout";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { examples } from "@/k";
import Link from "next/link";
import { ApiKeyReveal } from "@/components/api-key-reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CORS.SH - Complete",
};

export default function InitialOnboardingFinalPage({
  application,
}: {
  application: ApplicationWithApiKey;
}) {
  const demo_target_url =
    application.allowedOrigins[0] ?? "https://example.com";

  return (
    <FormPageLayout>
      <FormPageTitle>
        Extend your api call with{" "}
        <span className="underline">proxy.cors.sh</span>
      </FormPageTitle>

      <FormPageDescription>
        <span className="text-sm text-muted-foreground">
          We've sent you an email with the api key.
          <br />
          Please check your inbox :)
        </span>
        <br />
        <br />
        Let's get rid of the cors errors with proxy.cors.sh like below.
      </FormPageDescription>

      <div className="h-4" />

      <FormPageForm>
        <div className="space-y-6">
          <CodeExamples
            apikey={application.apikey_test}
            target={demo_target_url}
          />

          <ApiKeyReveal
            keys={{
              test: application.apikey_test,
              prod: application.apikey_live,
            }}
          />

          <div className="space-y-2">
            <Card>
              <CardHeader>
                <CardTitle>View more examples</CardTitle>
              </CardHeader>
              <CardContent>
                <MoreCodeExamples
                  apikey={application.apikey_test}
                  target={demo_target_url}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <h5 className="font-medium mb-2">Useful resources</h5>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="https://cors.sh/docs"
                      className="text-primary hover:underline"
                    >
                      Learn how to secure your api key
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://cors.sh/docs"
                      className="text-primary hover:underline"
                    >
                      Before publishing your website to production
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://cors.sh/docs"
                      className="text-primary hover:underline"
                    >
                      Create new application on console
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="h-8" />

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground italic">
            Thank you for using cors.sh 🙏
          </p>

          <Button asChild variant="link" className="p-0">
            <Link href="/contact">I need help</Link>
          </Button>
        </div>
      </FormPageForm>
    </FormPageLayout>
  );
}

function CodeExamples({ target, apikey }: { target: string; apikey: string }) {
  return (
    <div className="max-h-[240px] text-xs">
      <SyntaxHighlighter language="js">
        {examples.simplest(target, apikey)}
      </SyntaxHighlighter>
    </div>
  );
}

function MoreCodeExamples({
  target,
  apikey,
}: {
  target: string;
  apikey: string;
}) {
  return (
    <div className="max-h-[240px] text-xs">
      <SyntaxHighlighter language="js">
        {examples.axios(target, apikey)}
      </SyntaxHighlighter>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { app, checkout_session_id } = context.query;

  if (!app) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const client = new Client({
      "x-cors-service-checkout-session-id": checkout_session_id,
    });

    const application = await client.getApplication(app);

    return {
      props: {
        application,
      },
    };
  } catch (e) {
    console.error(e);
    // 404
    return {
      notFound: true,
    };
  }
}
