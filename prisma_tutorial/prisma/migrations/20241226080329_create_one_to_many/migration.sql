/*
  Warnings:

  - A unique constraint covering the columns `[type_role]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_roleType_fkey`;

-- DropIndex
DROP INDEX `User_roleType_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `roleType` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Roles_type_role_key` ON `Roles`(`type_role`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleType_fkey` FOREIGN KEY (`roleType`) REFERENCES `Roles`(`type_role`) ON DELETE CASCADE ON UPDATE CASCADE;
