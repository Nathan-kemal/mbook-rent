/*
  Warnings:

  - You are about to drop the column `uploadedBookId` on the `Book` table. All the data in the column will be lost.
  - Added the required column `bookId` to the `UploadedBook` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_uploadedBookId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "uploadedBookId";

-- AlterTable
ALTER TABLE "UploadedBook" ADD COLUMN     "bookId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UploadedBook" ADD CONSTRAINT "UploadedBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
