"use server";

import { prisma } from "@/lib/prisma";

export const getAbout = async () => {
  try {
    const [about, portrait] = await Promise.all([
      prisma.about.findFirst(),
      prisma.portreImage.findFirst(),
    ]);

    return {
      success: true,
      message: "Hakkımda bilgileri başarıyla alındı.",
      status: 200,
      result: { about, portrait },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Hakkımda bilgileri alınamadı.",
      status: 500,
      result: { about: null, portrait: null },
    };
  }
};
