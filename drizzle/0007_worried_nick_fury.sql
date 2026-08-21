CREATE TABLE `discount_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`discount_id` integer NOT NULL,
	`scope` text NOT NULL,
	`target_id` integer NOT NULL,
	FOREIGN KEY (`discount_id`) REFERENCES `discounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `discounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`type` text NOT NULL,
	`value` integer NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`starts_at` text,
	`ends_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `promo_code_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`promo_code_id` integer NOT NULL,
	`scope` text NOT NULL,
	`target_id` integer,
	`type` text NOT NULL,
	`value` integer NOT NULL,
	FOREIGN KEY (`promo_code_id`) REFERENCES `promo_codes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `promo_codes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`starts_at` text,
	`ends_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `promo_codes_code_unique` ON `promo_codes` (`code`);