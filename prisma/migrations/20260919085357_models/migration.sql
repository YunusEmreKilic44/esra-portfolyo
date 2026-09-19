/*
  Warnings:

  - You are about to drop the `CollectionImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CollectionImage" DROP CONSTRAINT "CollectionImage_collectionId_fkey";

-- DropTable
DROP TABLE "CollectionImage";

-- CreateTable
CREATE TABLE "collectionImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "collectionImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "collectionImage" ADD CONSTRAINT "collectionImage_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
