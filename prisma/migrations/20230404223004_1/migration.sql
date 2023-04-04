/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,first_name,last_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `password`,
    ADD COLUMN `hash` VARCHAR(191) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL,
    ADD COLUMN `salt` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `html` TEXT NOT NULL,
    `html_preview` TEXT NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `author_id` INTEGER NOT NULL,
    `author_firstname` VARCHAR(191) NOT NULL,
    `author_lastname` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_first_name_last_name_key` ON `User`(`id`, `first_name`, `last_name`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_author_id_author_firstname_author_lastname_fkey` FOREIGN KEY (`author_id`, `author_firstname`, `author_lastname`) REFERENCES `User`(`id`, `first_name`, `last_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
