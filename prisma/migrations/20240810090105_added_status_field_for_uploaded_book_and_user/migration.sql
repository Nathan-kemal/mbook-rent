/*
  Warnings:

  - You are about to drop the column `bookName` on the `Book` table. All the data in the column will be lost.
  - Added the required column `uu` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "bookName",
ADD COLUMN     "uu" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UploadedBook" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Pending Approval';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'Pending Approval';
