"use server";

import { prisma } from "@/lib/prisma";

export const getContact = async () => {
  try {
    const contact = await prisma.contact.findFirst();

    if (!contact) {
      return {
        success: false,
        message: "İletişim bilgileri alınamadı",
        status: 400,
        result: null,
      };
    }

    return {
      success: true,
      message: "İletişim bilgileri başarıyla alındı",
      status: 200,
      result: contact,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "İletişim bilgileri alınamadı",
      status: 500,
      result: null,
    };
  }
};
