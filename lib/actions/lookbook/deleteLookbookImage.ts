"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { deleteImages } from "@/services/uploadImages";
import { revalidatePath } from "next/cache";

export const deleteLookbookImage = async (imageId: string) => {
  await requireAdmin();

  try {
    const image = await prisma.lookbookImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return {
        success: false,
        message: "Silinecek lookbook görseli bulunamadı.",
        status: 404,
      };
    }

    await prisma.lookbookImage.delete({ where: { id: image.id } });
    await deleteImages([image.publicId]).catch(console.error);

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/lookbook");

    return {
      success: true,
      message: "Lookbook görseli başarıyla silindi.",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Lookbook görseli silinemedi.",
      status: 500,
    };
  }
};
