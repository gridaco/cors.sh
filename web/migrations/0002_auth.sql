-- Auth.js (NextAuth v5) identity tables for the D1 adapter (@auth/d1-adapter schema, verbatim).
-- The old control `accounts` table (id,name,tier) is replaced by Auth.js's `accounts`
-- (OAuth provider links). It was never read (the control routes use a hardcoded id), so
-- dropping it is safe. Account = user identity now lives in `users` (Phase 3 adds `tier`).
DROP TABLE IF EXISTS accounts;

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY NOT NULL DEFAULT '',
  name          TEXT,
  email         TEXT,
  emailVerified DATETIME,
  image         TEXT
);

CREATE TABLE IF NOT EXISTS accounts (
  id                 TEXT NOT NULL,
  userId             TEXT NOT NULL DEFAULT NULL,
  type               TEXT NOT NULL DEFAULT NULL,
  provider           TEXT NOT NULL DEFAULT NULL,
  providerAccountId  TEXT NOT NULL DEFAULT NULL,
  refresh_token      TEXT DEFAULT NULL,
  access_token       TEXT DEFAULT NULL,
  expires_at         NUMBER DEFAULT NULL,
  token_type         TEXT DEFAULT NULL,
  scope              TEXT DEFAULT NULL,
  id_token           TEXT DEFAULT NULL,
  session_state      TEXT DEFAULT NULL,
  oauth_token_secret TEXT DEFAULT NULL,
  oauth_token        TEXT DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT NOT NULL,
  sessionToken TEXT NOT NULL,
  userId       TEXT NOT NULL DEFAULT NULL,
  expires      DATETIME NOT NULL DEFAULT NULL,
  PRIMARY KEY (sessionToken)
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token      TEXT NOT NULL DEFAULT NULL,
  expires    DATETIME NOT NULL DEFAULT NULL,
  PRIMARY KEY (token)
);
