CREATE TABLE `password_reset_codes` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`user_id` int unsigned NOT NULL,
	`code_hash` varchar(255) NOT NULL,
	`purpose` varchar(32) NOT NULL,
	`expires_at` varchar(32) NOT NULL,
	`attempts` int unsigned NOT NULL DEFAULT 0,
	`used_at` varchar(32),
	`created_at` varchar(32) NOT NULL,
	CONSTRAINT `password_reset_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `password_reset_codes` ADD CONSTRAINT `password_reset_codes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_password_reset_user_created` ON `password_reset_codes` (`user_id`,`created_at`);