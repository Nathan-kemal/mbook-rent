-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "role" TEXT NOT NULL DEFAULT 'Owner',
    "avatar" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedBook" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rent" INTEGER NOT NULL,
    "cover" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "UploadedBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "bookName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "userId" TEXT,
    "uploadedBookId" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UploadedBook" ADD CONSTRAINT "UploadedBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_uploadedBookId_fkey" FOREIGN KEY ("uploadedBookId") REFERENCES "UploadedBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
