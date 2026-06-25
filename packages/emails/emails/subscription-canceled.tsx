import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, styles } from "./_components/layout";

export interface SubscriptionCanceledProps {
  planName?: string;
  effectiveDate?: string;
  isFinal?: boolean;
  reactivateUrl?: string;
}

export default function SubscriptionCanceledEmail({
  planName = "Pro",
  effectiveDate,
  isFinal = false,
  reactivateUrl = "https://cors.sh/console/settings",
}: SubscriptionCanceledProps) {
  return (
    <EmailLayout
      preview={isFinal ? "Your cors.sh subscription has ended" : "Your cors.sh plan will end"}
    >
      <Heading style={styles.heading}>
        {isFinal ? "Your subscription has ended" : `Your ${planName} plan is scheduled to end`}
      </Heading>
      {isFinal ? (
        <Text style={styles.text}>
          Your {planName} subscription has ended and your account is back on the Free plan. Your
          projects and keys keep working at Free-plan limits.
        </Text>
      ) : (
        <Text style={styles.text}>
          Your {planName} plan is set to cancel
          {effectiveDate ? ` on ${effectiveDate}` : " at the end of the current period"}. You keep{" "}
          {planName} access until then.
        </Text>
      )}
      <Section style={{ margin: "8px 0 20px" }}>
        <Button href={reactivateUrl} style={styles.button}>
          {isFinal ? "Resubscribe" : "Keep my plan"}
        </Button>
      </Section>
      <Text style={styles.muted}>Changed your mind? You can resubscribe anytime.</Text>
    </EmailLayout>
  );
}

SubscriptionCanceledEmail.PreviewProps = {
  planName: "Pro",
  effectiveDate: "July 25, 2026",
  isFinal: false,
} satisfies SubscriptionCanceledProps;
