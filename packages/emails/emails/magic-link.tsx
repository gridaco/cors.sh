import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, styles } from "./_components/layout";

export interface MagicLinkProps {
  url: string;
  host?: string;
  expiresMinutes?: number;
}

export default function MagicLinkEmail({
  url,
  host = "cors.sh",
  expiresMinutes = 60,
}: MagicLinkProps) {
  return (
    <EmailLayout preview={`Sign in to ${host}`}>
      <Heading style={styles.heading}>Sign in to cors.sh</Heading>
      <Text style={styles.text}>
        Click the button below to sign in. This link expires in {expiresMinutes} minutes and can
        only be used once.
      </Text>
      <Section style={{ margin: "8px 0 20px" }}>
        <Button href={url} style={styles.button}>
          Sign in
        </Button>
      </Section>
      <Text style={styles.muted}>Or paste this URL into your browser:</Text>
      <Text style={styles.urlBox}>{url}</Text>
      <Text style={styles.muted}>
        If you didn&apos;t request this email, you can safely ignore it.
      </Text>
    </EmailLayout>
  );
}

MagicLinkEmail.PreviewProps = {
  url: "https://cors.sh/api/auth/callback/resend?token=preview-token&email=you%40example.com",
  host: "cors.sh",
  expiresMinutes: 60,
} satisfies MagicLinkProps;
