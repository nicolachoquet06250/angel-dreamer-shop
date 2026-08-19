CREATE TABLE `universes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`image_id` integer,
	`position` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `universes` (`title`,`image_id`,`position`,`active`)
SELECT COALESCE((SELECT `value` FROM `site_content` WHERE `key`='universe1Title'),'Art & design'),(SELECT `image_id` FROM `site_content_images` WHERE `key`='universe1Image'),0,1;
--> statement-breakpoint
INSERT INTO `universes` (`title`,`image_id`,`position`,`active`)
SELECT COALESCE((SELECT `value` FROM `site_content` WHERE `key`='universe2Title'),'Manga & Japon'),(SELECT `image_id` FROM `site_content_images` WHERE `key`='universe2Image'),1,1;
--> statement-breakpoint
INSERT INTO `universes` (`title`,`image_id`,`position`,`active`)
SELECT COALESCE((SELECT `value` FROM `site_content` WHERE `key`='universe3Title'),'Cinéma & musique'),(SELECT `image_id` FROM `site_content_images` WHERE `key`='universe3Image'),2,1;
--> statement-breakpoint
INSERT INTO `universes` (`title`,`image_id`,`position`,`active`)
SELECT COALESCE((SELECT `value` FROM `site_content` WHERE `key`='universe4Title'),'Humour'),(SELECT `image_id` FROM `site_content_images` WHERE `key`='universe4Image'),3,1;
--> statement-breakpoint
DELETE FROM `site_content` WHERE `key` IN ('universe1Title','universe2Title','universe3Title','universe4Title');
--> statement-breakpoint
DELETE FROM `site_content_images` WHERE `key` IN ('universe1Image','universe2Image','universe3Image','universe4Image');
--> statement-breakpoint
CREATE INDEX `idx_universes_position` ON `universes` (`position`);
--> statement-breakpoint
CREATE INDEX `idx_universes_image_id` ON `universes` (`image_id`);
--> statement-breakpoint
PRAGMA optimize;
