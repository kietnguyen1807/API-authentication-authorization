/*
  Warnings:

  - You are about to drop the column `basis` on the `roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `roles` DROP COLUMN `basis`,
    ADD COLUMN `basic` VARCHAR(191) NULL;
