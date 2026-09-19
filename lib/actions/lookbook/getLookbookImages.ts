"use server";

import { prisma } from "@/lib/prisma";

export const getLookbookImages = async () => {
  try {
    const images = await prisma.lookbookImage.findMany({
      orderBy: { id: "desc" },
    });

    return {
      success: true,
      message: "Lookbook görselleri başarıyla alındı.",
      status: 200,
      result: images,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Lookbook görselleri alınamadı.",
      status: 500,
      result: [],
    };
  }
};
