"use server";

import { prisma } from "@/lib/prisma";

export const getCollections = async () => {
  try {
    const collections = await prisma.collection.findMany({
      include: { images: true },
      orderBy: { id: "desc" },
    });

    return {
      success: true,
      message: "Koleksiyonlar başarıyla alındı.",
      status: 200,
      result: collections,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Koleksiyonlar alınamadı.",
      status: 500,
      result: [],
    };
  }
};
