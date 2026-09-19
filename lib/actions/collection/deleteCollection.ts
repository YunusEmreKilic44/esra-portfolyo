"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { deleteImages } from "@/services/uploadImages";
import { revalidatePath } from "next/cache";

export const deleteCollection = async (collectionId: string) => {
  await requireAdmin();

  try {
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: { images: true },
    });

    if (!collection) {
      return {
        success: false,
        message: "Silinecek koleksiyon bulunamadı.",
        status: 404,
      };
    }

    await prisma.collection.delete({ where: { id: collection.id } });
    await deleteImages(collection.images.map((image) => image.publicId)).catch(
      console.error,
    );

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/works");
    revalidatePath(`/tasarimlar/${collection.id}`);
    revalidatePath("/tasarimlar/[tasarimId]", "page");

    return {
      success: true,
      message: "Koleksiyon başarıyla silindi.",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Koleksiyon silinemedi.",
      status: 500,
    };
  }
};
