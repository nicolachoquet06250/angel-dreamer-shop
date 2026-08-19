ALTER TABLE `products` ADD COLUMN `featured_position` integer;
--> statement-breakpoint
UPDATE `products` SET `featured_position`=`id` WHERE `featured`=1;
