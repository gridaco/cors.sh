-- Standalone Stripe billing. `users.tier` stays the denormalized fast-read the proxy/CRUD use;
-- `subscriptions` is the source-of-record; `stripe_events` is the webhook idempotency ledger.
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);

CREATE TABLE IF NOT EXISTS subscriptions (
  user_id                TEXT PRIMARY KEY,
  stripe_customer_id     TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  status                 TEXT NOT NULL,          -- stripe status verbatim
  price_id               TEXT NOT NULL,
  current_period_start   INTEGER,                -- unix seconds
  current_period_end     INTEGER,                -- unix seconds
  cancel_at_period_end   INTEGER NOT NULL DEFAULT 0,
  updated_at             INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_sub ON subscriptions(stripe_subscription_id);

CREATE TABLE IF NOT EXISTS stripe_events (
  id           TEXT PRIMARY KEY,   -- Stripe event id (evt_…) — idempotency
  type         TEXT NOT NULL,
  processed_at INTEGER NOT NULL
);
