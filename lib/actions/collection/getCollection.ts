"use server";

import { prisma } from "@/lib/prisma";

export const getCollection = async (collectionId: string) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: { images: true },
    });

    return {
      success: Boolean(collection),
      message: collection
        ? "Koleksiyon başarıyla alındı."
        : "Koleksiyon bulunamadı.",
      status: collection ? 200 : 404,
      result: collection,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Koleksiyon alınamadı.",
      status: 500,
      result: null,
    };
  }
};
