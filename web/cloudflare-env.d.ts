import type { D1Database, KVNamespace } from "@cloudflare/workers-types";

declare global {
  /** Bindings + vars available to server routes via `getCloudflareContext().env` (OpenNext). */
  interface CloudflareEnv {
    DB: D1Database;
    KEYS: KVNamespace;
    // Auth.js
    AUTH_SECRET?: string;
    // Email (Resend) — read by @workspace/emails
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    EMAIL_REPLY_TO?: string;
    EMAIL_DRY_RUN?: string;
    // Stripe billing
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    STRIPE_PRICE_PRO_MONTHLY?: string;
    STRIPE_PRICE_PRO_ANNUAL?: string;
    NEXT_PUBLIC_APP_URL?: string;
    // Shared secret the proxy presents when pinging the quota-notification endpoint.
    INTERNAL_SECRET?: string;
  }
}

export {};
