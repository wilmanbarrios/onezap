CREATE TABLE `onezap_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nid` varchar(12),
	`title` text,
	`url` int,
	`fav_icon_url` text,
	`user_id` int,
	`group` varchar(12),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `onezap_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `onezap_user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(100),
	`last_name` varchar(100),
	`email` varchar(200),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `onezap_user_id` PRIMARY KEY(`id`)
);
