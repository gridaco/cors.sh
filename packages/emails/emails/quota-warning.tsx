import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, styles } from "./_components/layout";

export interface QuotaWarningProps {
  metric?: string; // "requests" | "bandwidth"
  used?: string;
  limit?: string;
  usedPct?: number;
  upgradeUrl?: string;
}

export default function QuotaWarningEmail({
  metric = "requests",
  used = "8,000",
  limit = "10,000",
  usedPct = 80,
  upgradeUrl = "https://cors.sh/console/settings",
}: QuotaWarningProps) {
  return (
    <EmailLayout preview={`You've used ${usedPct}% of your monthly ${metric}`}>
      <Heading style={styles.heading}>
        You&apos;re at {usedPct}% of your {metric} quota
      </Heading>
      <Text style={styles.text}>
        You&apos;ve used <strong>{used}</strong> of your <strong>{limit}</strong> monthly {metric}.
        When you hit the limit, further requests are rejected with a 429 until the next period.
      </Text>
      <Section style={{ margin: "8px 0 20px" }}>
        <Button href={upgradeUrl} style={styles.button}>
          Upgrade for higher limits
        </Button>
      </Section>
      <Text style={styles.muted}>You can turn off these warnings in Account &amp; billing.</Text>
    </EmailLayout>
  );
}

QuotaWarningEmail.PreviewProps = {
  metric: "requests",
  used: "8,000",
  limit: "10,000",
  usedPct: 80,
} satisfies QuotaWarningProps;
