CREATE TABLE `categories` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`label` varchar(255) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	`active` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`content` longtext NOT NULL,
	`mime_type` varchar(64) NOT NULL,
	`width` int unsigned NOT NULL,
	`height` int unsigned NOT NULL,
	`natural_width` int unsigned NOT NULL,
	`natural_height` int unsigned NOT NULL,
	`dark_image_id` int unsigned,
	`created_at` varchar(32) NOT NULL,
	`updated_at` varchar(32) NOT NULL,
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`provider` varchar(32) NOT NULL,
	`provider_order_id` varchar(191) NOT NULL,
	`amount_cents` int unsigned NOT NULL,
	`status` varchar(64) NOT NULL,
	`customer_email` varchar(191),
	`created_at` varchar(32) NOT NULL,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_orders_provider_id` UNIQUE(`provider`,`provider_order_id`)
);
--> statement-breakpoint
CREATE TABLE `product_categories` (
	`product_id` int unsigned NOT NULL,
	`category_id` int unsigned NOT NULL,
	CONSTRAINT `product_categories_product_id_category_id_pk` PRIMARY KEY(`product_id`,`category_id`)
);
--> statement-breakpoint
CREATE TABLE `product_universes` (
	`product_id` int unsigned NOT NULL,
	`universe_id` int unsigned NOT NULL,
	CONSTRAINT `product_universes_product_id_universe_id_pk` PRIMARY KEY(`product_id`,`universe_id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`slug` varchar(191) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`price_cents` int unsigned NOT NULL,
	`image_id` int unsigned,
	`category` varchar(191) NOT NULL DEFAULT '',
	`featured` tinyint NOT NULL DEFAULT 0,
	`featured_position` int,
	`active` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`key` varchar(191) NOT NULL,
	`value` text NOT NULL,
	CONSTRAINT `site_content_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `site_content_images` (
	`key` varchar(191) NOT NULL,
	`image_id` int unsigned NOT NULL,
	CONSTRAINT `site_content_images_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `universes` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(191),
	`image_id` int unsigned,
	`position` int NOT NULL DEFAULT 0,
	`active` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `universes_id` PRIMARY KEY(`id`),
	CONSTRAINT `universes_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`email` varchar(191) NOT NULL,
	`first_name` varchar(80),
	`last_name` varchar(80),
	`password_hash` varchar(255) NOT NULL,
	`role` varchar(32) NOT NULL DEFAULT 'customer',
	`active` tinyint NOT NULL DEFAULT 1,
	`must_change_password` tinyint NOT NULL DEFAULT 0,
	`created_at` varchar(32) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_dark_image_id_images_id_fk` FOREIGN KEY (`dark_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_categories` ADD CONSTRAINT `product_categories_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_categories` ADD CONSTRAINT `product_categories_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_universes` ADD CONSTRAINT `product_universes_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_universes` ADD CONSTRAINT `product_universes_universe_id_universes_id_fk` FOREIGN KEY (`universe_id`) REFERENCES `universes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_image_id_images_id_fk` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_content_images` ADD CONSTRAINT `site_content_images_image_id_images_id_fk` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `universes` ADD CONSTRAINT `universes_image_id_images_id_fk` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;