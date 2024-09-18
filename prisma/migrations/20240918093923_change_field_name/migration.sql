/*
  Warnings:

  - You are about to drop the column `cloud` on the `File` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Config" AS ENUM ('local', 'google', 'aws', 'azure', 'cloudinary');

-- AlterTable
ALTER TABLE "File" DROP COLUMN "cloud",
ADD COLUMN     "config" "Config";

-- DropEnum
DROP TYPE "CloudProvider";
