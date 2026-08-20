ALTER TABLE `users` ADD `created_by_admin_id` integer REFERENCES users(id) ON DELETE SET NULL;
