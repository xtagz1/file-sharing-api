/*
  Warnings:

  - The values [GOOGLE,AWS,AZURE,CLOUDINARY] on the enum `CloudProvider` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CloudProvider_new" AS ENUM ('google', 'aws', 'azure', 'cloudinary');
ALTER TABLE "File" ALTER COLUMN "cloud" TYPE "CloudProvider_new" USING ("cloud"::text::"CloudProvider_new");
ALTER TYPE "CloudProvider" RENAME TO "CloudProvider_old";
ALTER TYPE "CloudProvider_new" RENAME TO "CloudProvider";
DROP TYPE "CloudProvider_old";
COMMIT;
