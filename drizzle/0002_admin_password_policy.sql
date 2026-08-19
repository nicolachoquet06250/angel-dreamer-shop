ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
PRAGMA optimize;
