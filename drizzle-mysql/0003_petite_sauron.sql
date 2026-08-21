CREATE TABLE `discount_rules` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`discount_id` int unsigned NOT NULL,
	`scope` varchar(16) NOT NULL,
	`target_id` int unsigned NOT NULL,
	CONSTRAINT `discount_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discounts` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`label` varchar(255) NOT NULL,
	`type` varchar(16) NOT NULL,
	`value` int unsigned NOT NULL,
	`active` tinyint NOT NULL DEFAULT 1,
	`starts_at` varchar(32),
	`ends_at` varchar(32),
	`created_at` varchar(32) NOT NULL,
	CONSTRAINT `discounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promo_code_rules` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`promo_code_id` int unsigned NOT NULL,
	`scope` varchar(16) NOT NULL,
	`target_id` int unsigned,
	`type` varchar(16) NOT NULL,
	`value` int unsigned NOT NULL,
	CONSTRAINT `promo_code_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promo_codes` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`active` tinyint NOT NULL DEFAULT 1,
	`starts_at` varchar(32),
	`ends_at` varchar(32),
	`created_at` varchar(32) NOT NULL,
	CONSTRAINT `promo_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `promo_codes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `discount_rules` ADD CONSTRAINT `discount_rules_discount_id_discounts_id_fk` FOREIGN KEY (`discount_id`) REFERENCES `discounts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `promo_code_rules` ADD CONSTRAINT `promo_code_rules_promo_code_id_promo_codes_id_fk` FOREIGN KEY (`promo_code_id`) REFERENCES `promo_codes`(`id`) ON DELETE cascade ON UPDATE no action;