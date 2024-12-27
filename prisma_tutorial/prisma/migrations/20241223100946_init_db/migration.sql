/*
  Warnings:

  - You are about to drop the column `userId` on the `account` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Account_userId_key` ON `account`;

-- AlterTable
ALTER TABLE `account` DROP COLUMN `userId`;
