export {
  sendMagicLink,
  sendWelcome,
  sendSubscriptionConfirmed,
  sendSubscriptionCanceled,
  sendPaymentFailed,
  sendQuotaWarning,
  sendQuotaExceeded,
  type EmailEnv,
} from "./send";
export type { MagicLinkProps } from "../emails/magic-link";
export type { WelcomeProps } from "../emails/welcome";
export type { SubscriptionConfirmedProps } from "../emails/subscription-confirmed";
export type { SubscriptionCanceledProps } from "../emails/subscription-canceled";
export type { PaymentFailedProps } from "../emails/payment-failed";
export type { QuotaWarningProps } from "../emails/quota-warning";
export type { QuotaExceededProps } from "../emails/quota-exceeded";
