ALTER TABLE `universes` ADD COLUMN `slug` text;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_universes_slug` ON `universes` (`slug`) WHERE `slug` IS NOT NULL AND `slug` <> '';
