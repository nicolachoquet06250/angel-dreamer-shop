CREATE TABLE `categories` (`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,`label` text NOT NULL,`slug` text NOT NULL,`position` integer DEFAULT 0 NOT NULL,`active` integer DEFAULT true NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_categories_slug` ON `categories` (`slug`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_categories_position` ON `categories` (`position`);
--> statement-breakpoint
CREATE TABLE `product_categories` (`product_id` integer NOT NULL REFERENCES `products`(`id`) ON DELETE cascade,`category_id` integer NOT NULL REFERENCES `categories`(`id`) ON DELETE cascade,PRIMARY KEY(`product_id`,`category_id`));
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_product_categories_category` ON `product_categories` (`category_id`,`product_id`);
--> statement-breakpoint
CREATE TABLE `product_universes` (`product_id` integer NOT NULL REFERENCES `products`(`id`) ON DELETE cascade,`universe_id` integer NOT NULL REFERENCES `universes`(`id`) ON DELETE cascade,PRIMARY KEY(`product_id`,`universe_id`));
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_product_universes_universe` ON `product_universes` (`universe_id`,`product_id`);
--> statement-breakpoint
INSERT INTO `categories` (`label`,`slug`,`position`,`active`) VALUES ('Nouveautés','nouveautes',0,1),('Vêtements','vetements',1,1),('Maison & déco','maison-deco',2,1);
--> statement-breakpoint
INSERT INTO `product_categories` (`product_id`,`category_id`) SELECT `id`,(SELECT `id` FROM `categories` WHERE `slug`='nouveautes') FROM `products`;
--> statement-breakpoint
INSERT INTO `product_universes` (`product_id`,`universe_id`) SELECT `id`,(SELECT `id` FROM `universes` ORDER BY `position`,`id` LIMIT 1) FROM `products` WHERE EXISTS(SELECT 1 FROM `universes`);
--> statement-breakpoint
PRAGMA optimize;
