import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, styles } from "./_components/layout";

export interface WelcomeProps {
  name?: string;
  consoleUrl?: string;
  docsUrl?: string;
}

export default function WelcomeEmail({
  name,
  consoleUrl = "https://cors.sh/console",
  docsUrl = "https://cors.sh/docs",
}: WelcomeProps) {
  return (
    <EmailLayout preview="Welcome to cors.sh">
      <Heading style={styles.heading}>Welcome to cors.sh{name ? `, ${name}` : ""}</Heading>
      <Text style={styles.text}>
        Thanks for signing up. cors.sh is a CORS proxy that lets your frontend call any API
        without &ldquo;blocked by CORS policy&rdquo; errors — no backend required.
      </Text>
      <Text style={styles.text}>Three steps to get going:</Text>
      <Text style={styles.text}>
        1. Create a project — you&apos;ll get a <strong>live</strong> key (pinned to your
        site&apos;s origin) and a <strong>test</strong> key (for local dev).
        <br />
        2. Point requests at <code>https://proxy.cors.sh/&lt;target-url&gt;</code> with your key
        in the <code>x-cors-api-key</code> header.
        <br />
        3. Ship — CORS just works.
      </Text>
      <Section style={{ margin: "8px 0 20px" }}>
        <Button href={`${consoleUrl}/new`} style={styles.button}>
          Create your first project
        </Button>
      </Section>
      <Text style={styles.muted}>
        New here? The quickstart walks through it: {docsUrl}/quickstart
      </Text>
    </EmailLayout>
  );
}

WelcomeEmail.PreviewProps = { name: "Alex" } satisfies WelcomeProps;
