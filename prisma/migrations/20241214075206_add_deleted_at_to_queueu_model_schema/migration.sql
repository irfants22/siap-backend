-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'DIBATALKAN';

-- AlterTable
ALTER TABLE "queues" ADD COLUMN     "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;