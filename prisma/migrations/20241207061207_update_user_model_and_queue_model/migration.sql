/*
  Warnings:

  - You are about to alter the column `nik` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(16)`.
  - A unique constraint covering the columns `[password]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'TERLEWAT';

-- AlterTable
ALTER TABLE "queues" ALTER COLUMN "viewed" SET DEFAULT false;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "nik" SET DATA TYPE VARCHAR(16);

-- CreateIndex
CREATE UNIQUE INDEX "users_password_key" ON "users"("password");
