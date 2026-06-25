-- Account = user. Tier lives on the Auth.js `users` row (denormalized fast-read the proxy/CRUD use).
-- `projects/keys/usage.account_id` now hold a `users.id` instead of the old 'dev' stub. SQLite has
-- no FK enforcement here, so this is a semantic repoint — plus a cleanup of any leftover dev rows.
ALTER TABLE users ADD COLUMN tier TEXT NOT NULL DEFAULT 'free';

DELETE FROM projects WHERE account_id = 'dev';
DELETE FROM keys WHERE account_id = 'dev';
DELETE FROM usage WHERE account_id = 'dev';
