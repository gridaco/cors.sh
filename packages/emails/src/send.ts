import * as React from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import MagicLinkEmail, { type MagicLinkProps } from "../emails/magic-link";
import WelcomeEmail, { type WelcomeProps } from "../emails/welcome";
import SubscriptionConfirmedEmail, {
  type SubscriptionConfirmedProps,
} from "../emails/subscription-confirmed";
import SubscriptionCanceledEmail, {
  type SubscriptionCanceledProps,
} from "../emails/subscription-canceled";
import PaymentFailedEmail, { type PaymentFailedProps } from "../emails/payment-failed";
import QuotaWarningEmail, { type QuotaWarningProps } from "../emails/quota-warning";
import QuotaExceededEmail, { type QuotaExceededProps } from "../emails/quota-exceeded";

/** Email config, read from the worker env (passed in — never from process.env at module load). */
export interface EmailEnv {
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  EMAIL_REPLY_TO?: string;
  /** "1" → log instead of send (CI / local dev). Also implied when RESEND_API_KEY is absent. */
  EMAIL_DRY_RUN?: string;
}

const FROM_DEFAULT = "cors.sh <noreply@cors.sh>";
const REPLY_TO_DEFAULT = "hello@cors.sh";

type SendResult = { id?: string } | { skipped: true };

async function sendEmail(
  env: EmailEnv,
  args: { to: string; subject: string; react: React.ReactElement },
): Promise<SendResult> {
  // Render at send time. react-dom/server runs fine on the Workers runtime (Next SSRs there too).
  const html = await render(args.react, { pretty: false });

  if (env.EMAIL_DRY_RUN === "1" || !env.RESEND_API_KEY) {
    // Prefer the action link (the one carrying a token); fall back to the first URL.
    // Unescape HTML entities so the logged URL is directly usable (e2e sign-in reads this).
    const match =
      html.match(/https?:\/\/[^"'\s<>]*token=[^"'\s<>]*/)?.[0] ??
      html.match(/https?:\/\/[^"'\s<>]+/)?.[0];
    const link = match?.replace(/&amp;/g, "&").replace(/&#x2F;/g, "/");
    // eslint-disable-next-line no-console
    console.log(
      `[email:dry-run] to=${args.to} subject=${JSON.stringify(args.subject)} bytes=${html.length}` +
        (link ? ` link=${link}` : ""),
    );
    return { skipped: true };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM ?? FROM_DEFAULT,
    to: args.to,
    replyTo: env.EMAIL_REPLY_TO ?? REPLY_TO_DEFAULT,
    subject: args.subject,
    html,
  });
  if (error) throw new Error(`Resend send failed: ${error.message}`);
  return { id: data?.id };
}

export function sendMagicLink(
  env: EmailEnv,
  to: string,
  props: MagicLinkProps,
): Promise<SendResult> {
  return sendEmail(env, {
    to,
    subject: "Sign in to cors.sh",
    react: React.createElement(MagicLinkEmail, props),
  });
}

export function sendWelcome(
  env: EmailEnv,
  to: string,
  props: WelcomeProps = {},
): Promise<SendResult> {
  return sendEmail(env, {
    to,
    subject: "Welcome to cors.sh",
    react: React.createElement(WelcomeEmail, props),
  });
}

export function sendSubscriptionConfirmed(
  env: EmailEnv,
  to: string,
  props: SubscriptionConfirmedProps = {},
): Promise<SendResult> {
  return sendEmail(env, {
    to,
    subject: `You're on cors.sh ${props.planName ?? "Pro"}`,
    react: React.createElement(SubscriptionConfirmedEmail, props),
  });
}

export function sendSubscriptionCanceled(
  env: EmailEnv,
  to: string,
  props: SubscriptionCanceledProps = {},
): Promise<SendResult> {
  return sendEmail(env, {
    to,
    subject: props.isFinal
      ? "Your cors.sh subscription has ended"
      : "Your cors.sh plan is scheduled to end",
    react: React.createElement(SubscriptionCanceledEmail, props),
  });
}

export function sendPaymentFailed(
  env: EmailEnv,
  to: string,
  props: PaymentFailedProps = {},
): Promise<SendResult> {
  return sendEmail(env, {
    to,
    subject: "Payment failed — action needed",
    react: React.createElement(PaymentFailedEmail, props),
  });
}

export function sendQuotaWarning(
  env: EmailEnv,
  to: string,
  props: QuotaWarningProps = {},
): Promise<SendResult> {
  return sendEmail(env, {
    to,
    subject: `You've used ${props.usedPct ?? 80}% of your monthly ${props.metric ?? "requests"}`,
    react: React.createElement(QuotaWarningEmail, props),
  });
}

export function sendQuotaExceeded(
  env: EmailEnv,
  to: string,
  props: QuotaExceededProps = {},
): Promise<SendResult> {
  return sendEmail(env, {
    to,
    subject: `You've hit your monthly ${props.metric ?? "requests"} limit`,
    react: React.createElement(QuotaExceededEmail, props),
  });
}
