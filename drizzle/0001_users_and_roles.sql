CREATE TABLE `users` (`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL, `email` text NOT NULL, `password_hash` text NOT NULL, `role` text DEFAULT 'customer' NOT NULL, `active` integer DEFAULT true NOT NULL, `created_at` text NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_email` ON `users` (`email`);
