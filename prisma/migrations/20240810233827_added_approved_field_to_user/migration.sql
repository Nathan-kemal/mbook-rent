-- AlterTable
ALTER TABLE "User" ADD COLUMN     "approved" TEXT NOT NULL DEFAULT 'Pending',
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
