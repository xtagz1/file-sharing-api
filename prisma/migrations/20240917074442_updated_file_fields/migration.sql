/*
  Warnings:

  - Added the required column `filePath` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isLocal` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CloudProvider" AS ENUM ('GOOGLE', 'AWS', 'AZURE', 'CLOUDINARY');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "cloud" "CloudProvider",
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "isLocal" BOOLEAN NOT NULL;
