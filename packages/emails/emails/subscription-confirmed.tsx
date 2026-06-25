import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, styles } from "./_components/layout";

export interface SubscriptionConfirmedProps {
  planName?: string;
  requestQuota?: string;
  bandwidthQuota?: string;
  consoleUrl?: string;
}

export default function SubscriptionConfirmedEmail({
  planName = "Pro",
  requestQuota = "500,000 requests / month",
  bandwidthQuota = "500 GB / month",
  consoleUrl = "https://cors.sh/console",
}: SubscriptionConfirmedProps) {
  return (
    <EmailLayout preview={`You're on cors.sh ${planName}`}>
      <Heading style={styles.heading}>You&apos;re on {planName} 🎉</Heading>
      <Text style={styles.text}>
        Your subscription is active. Your new limits are live across all of your projects:
      </Text>
      <Text style={styles.text}>
        • {requestQuota}
        <br />• {bandwidthQuota}
      </Text>
      <Section style={{ margin: "8px 0 20px" }}>
        <Button href={consoleUrl} style={styles.button}>
          Open the console
        </Button>
      </Section>
      <Text style={styles.muted}>
        Manage your subscription anytime from Account &amp; billing. Stripe sends your receipts
        separately.
      </Text>
    </EmailLayout>
  );
}

SubscriptionConfirmedEmail.PreviewProps = { planName: "Pro" } satisfies SubscriptionConfirmedProps;
