-- Control-plane schema (Cloudflare D1). Folded into the Next app.
-- Phase 1: account/billing still stubbed (single `dev` account). Phases 2-3 add the
-- Auth.js identity tables and repoint account_id -> users.id.
CREATE TABLE IF NOT EXISTS accounts (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  tier       TEXT NOT NULL DEFAULT 'free',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id              TEXT PRIMARY KEY,
  account_id      TEXT NOT NULL,
  name            TEXT NOT NULL,
  allowed_origins TEXT NOT NULL DEFAULT '[]', -- JSON array
  allowed_targets TEXT NOT NULL DEFAULT '[]', -- JSON array
  created_at      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS keys (
  key        TEXT PRIMARY KEY,         -- the full api key (live_/test_...)
  project_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  key_type   TEXT NOT NULL,            -- 'live' | 'test'
  active     INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_keys_project ON keys(project_id);

CREATE TABLE IF NOT EXISTS usage (
  account_id TEXT NOT NULL,
  period     TEXT NOT NULL,            -- 'YYYY-MM'
  requests   INTEGER NOT NULL DEFAULT 0,
  bytes      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (account_id, period)
);

-- Dev account (stub until auth lands; tier pro for generous demo quotas).
INSERT OR IGNORE INTO accounts (id, name, tier, created_at) VALUES ('dev', 'Dev Account', 'pro', 0);
