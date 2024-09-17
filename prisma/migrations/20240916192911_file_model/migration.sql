/*
  Warnings:

  - Added the required column `privateKey` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicKey` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "privateKey" TEXT NOT NULL,
ADD COLUMN     "publicKey" TEXT NOT NULL;
