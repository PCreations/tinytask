CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`citation` text DEFAULT '',
	`priority` integer DEFAULT 0
);
