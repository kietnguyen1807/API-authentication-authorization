/*
  Warnings:

  - You are about to drop the column `admin` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `basic` on the `roles` table. All the data in the column will be lost.
  - Added the required column `type_role` to the `Roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `roles` DROP COLUMN `admin`,
    DROP COLUMN `basic`,
    ADD COLUMN `type_role` VARCHAR(191) NOT NULL;
