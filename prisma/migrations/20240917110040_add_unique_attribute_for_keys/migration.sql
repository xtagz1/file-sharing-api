/*
  Warnings:

  - A unique constraint covering the columns `[publicKey]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[privateKey]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_publicKey_key" ON "File"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "File_privateKey_key" ON "File"("privateKey");
