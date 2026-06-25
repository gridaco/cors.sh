import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, styles } from "./_components/layout";

export interface QuotaExceededProps {
  metric?: string; // "requests" | "bandwidth"
  used?: string;
  limit?: string;
  resetDate?: string;
  upgradeUrl?: string;
}

export default function QuotaExceededEmail({
  metric = "requests",
  used = "10,000",
  limit = "10,000",
  resetDate,
  upgradeUrl = "https://cors.sh/console/settings",
}: QuotaExceededProps) {
  return (
    <EmailLayout preview={`You've hit your monthly ${metric} limit`}>
      <Heading style={styles.heading}>You&apos;ve hit your {metric} limit</Heading>
      <Text style={styles.text}>
        You&apos;ve used <strong>{used}</strong> of your <strong>{limit}</strong> monthly {metric}.
        Requests are now being rejected with a 429{resetDate ? ` until ${resetDate}` : " until your quota resets"}.
      </Text>
      <Section style={{ margin: "8px 0 20px" }}>
        <Button href={upgradeUrl} style={styles.button}>
          Upgrade to restore service
        </Button>
      </Section>
      <Text style={styles.muted}>Upgrading raises your limit immediately.</Text>
    </EmailLayout>
  );
}

QuotaExceededEmail.PreviewProps = {
  metric: "requests",
  used: "10,000",
  limit: "10,000",
} satisfies QuotaExceededProps;
