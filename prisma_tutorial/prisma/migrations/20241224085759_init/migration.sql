-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_email_fkey`;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
