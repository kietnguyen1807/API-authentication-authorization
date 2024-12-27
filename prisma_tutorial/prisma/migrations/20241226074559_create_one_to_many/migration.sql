-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_roleType_fkey`;

-- DropIndex
DROP INDEX `User_roleType_fkey` ON `user`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleType_fkey` FOREIGN KEY (`roleType`) REFERENCES `Roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
