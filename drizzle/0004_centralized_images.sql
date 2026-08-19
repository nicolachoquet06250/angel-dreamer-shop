CREATE TABLE `images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`mime_type` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`natural_width` integer NOT NULL,
	`natural_height` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `images` (`content`,`mime_type`,`width`,`height`,`natural_width`,`natural_height`,`created_at`,`updated_at`)
SELECT DISTINCT `image_url`, CASE WHEN `image_url` LIKE 'data:image/%' THEN substr(`image_url`,6,instr(`image_url`,';')-6) ELSE 'image/unknown' END, 1, 1, 1, 1, datetime('now'), datetime('now')
FROM `products` WHERE `image_url` <> '';
--> statement-breakpoint
INSERT INTO `images` (`content`,`mime_type`,`width`,`height`,`natural_width`,`natural_height`,`created_at`,`updated_at`)
SELECT `value`, CASE WHEN `value` LIKE 'data:image/%' THEN substr(`value`,6,instr(`value`,';')-6) ELSE 'image/unknown' END, 1, 1, 1, 1, datetime('now'), datetime('now')
FROM `site_content` WHERE `key` IN ('heroImage','universe1Image','universe2Image','universe3Image','universe4Image','workshopImage') AND `value` <> '';
--> statement-breakpoint
ALTER TABLE `products` RENAME TO `products_legacy_images`;
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`price_cents` integer NOT NULL,
	`image_id` integer,
	`category` text NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `products` (`id`,`slug`,`name`,`description`,`price_cents`,`image_id`,`category`,`featured`,`active`)
SELECT p.`id`,p.`slug`,p.`name`,p.`description`,p.`price_cents`,(SELECT i.`id` FROM `images` i WHERE i.`content`=p.`image_url` LIMIT 1),p.`category`,p.`featured`,p.`active` FROM `products_legacy_images` p;
--> statement-breakpoint
DROP TABLE `products_legacy_images`;
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);
--> statement-breakpoint
CREATE INDEX `idx_products_active_featured` ON `products` (`active`,`featured`);
--> statement-breakpoint
CREATE INDEX `idx_products_image_id` ON `products` (`image_id`);
--> statement-breakpoint
CREATE TABLE `site_content_images` (
	`key` text PRIMARY KEY NOT NULL,
	`image_id` integer NOT NULL,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `site_content_images` (`key`,`image_id`)
SELECT sc.`key`,(SELECT i.`id` FROM `images` i WHERE i.`content`=sc.`value` ORDER BY i.`id` DESC LIMIT 1) FROM `site_content` sc
WHERE sc.`key` IN ('heroImage','universe1Image','universe2Image','universe3Image','universe4Image','workshopImage') AND sc.`value` <> '';
--> statement-breakpoint
DELETE FROM `site_content` WHERE `key` IN ('heroImage','universe1Image','universe2Image','universe3Image','universe4Image','workshopImage');
--> statement-breakpoint
CREATE INDEX `idx_site_content_images_image_id` ON `site_content_images` (`image_id`);
--> statement-breakpoint
PRAGMA optimize;
