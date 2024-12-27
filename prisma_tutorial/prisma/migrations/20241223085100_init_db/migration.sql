-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NULL DEFAULT '',
    `email` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL DEFAULT '',
    `location` VARCHAR(191) NULL DEFAULT '',
    `birthday` DATETIME(3) NULL,

    UNIQUE INDEX `User_firstName_key`(`firstName`),
    UNIQUE INDEX `User_lastName_key`(`lastName`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
