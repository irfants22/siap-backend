/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `queues` table. All the data in the column will be lost.
  - You are about to drop the column `viewed` on the `queues` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "queues" DROP COLUMN "deleted_at",
DROP COLUMN "viewed",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isViewed" BOOLEAN NOT NULL DEFAULT false;
