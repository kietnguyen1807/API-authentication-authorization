-- DropIndex
DROP INDEX `User_firstName_key` ON `user`;

-- DropIndex
DROP INDEX `User_lastName_key` ON `user`;

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `middleName` DROP DEFAULT,
    ALTER COLUMN `avatar` DROP DEFAULT,
    ALTER COLUMN `location` DROP DEFAULT;
