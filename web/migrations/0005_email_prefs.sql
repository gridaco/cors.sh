-- Quota-notification bookkeeping. Fire-once-per-period guards live on the usage row;
-- the user-facing preference (gates the 80% warning only) lives on the user.
ALTER TABLE usage ADD COLUMN notified_80 INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usage ADD COLUMN notified_100 INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN notify_quota INTEGER NOT NULL DEFAULT 1;
