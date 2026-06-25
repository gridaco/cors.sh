import { Button, Heading, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, styles } from "./_components/layout";

export interface PaymentFailedProps {
  amountDue?: string;
  updatePaymentUrl?: string;
}

export default function PaymentFailedEmail({
  amountDue,
  updatePaymentUrl = "https://cors.sh/console/settings",
}: PaymentFailedProps) {
  return (
    <EmailLayout preview="Payment failed — action needed">
      <Heading style={styles.heading}>We couldn&apos;t process your payment</Heading>
      <Text style={styles.text}>
        Your most recent payment{amountDue ? ` of ${amountDue}` : ""} didn&apos;t go through. We&apos;ll
        retry automatically, but to avoid any interruption please update your payment method.
      </Text>
      <Section style={{ margin: "8px 0 20px" }}>
        <Button href={updatePaymentUrl} style={styles.button}>
          Update payment method
        </Button>
      </Section>
      <Text style={styles.muted}>
        Your plan stays active while we retry. If the retries are exhausted, your account returns to
        the Free plan.
      </Text>
    </EmailLayout>
  );
}

PaymentFailedEmail.PreviewProps = { amountDue: "$4.00" } satisfies PaymentFailedProps;
