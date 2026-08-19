ALTER TABLE `images` ADD `dark_image_id` integer REFERENCES `images`(`id`) ON DELETE SET NULL;
--> statement-breakpoint
CREATE INDEX `idx_images_dark_image_id` ON `images` (`dark_image_id`);
--> statement-breakpoint
PRAGMA optimize;
