/*
  Warnings:

  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LookbookImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortreImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Contact";

-- DropTable
DROP TABLE "LookbookImage";

-- DropTable
DROP TABLE "PortreImage";

-- CreateTable
CREATE TABLE "portreImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,

    CONSTRAINT "portreImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lookbookImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,

    CONSTRAINT "lookbookImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "linkedin" TEXT NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);
