"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import {
  deleteImages,
  ImageUploadError,
  uploadImages,
} from "@/services/uploadImages";
import { revalidatePath } from "next/cache";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const createLookbookImages = async (formData: FormData) => {
  await requireAdmin();

  let uploadedImages: Awaited<ReturnType<typeof uploadImages>> = [];

  try {
    const imageFiles = formData
      .getAll("images")
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (imageFiles.length < 1 || imageFiles.length > 4) {
      return {
        success: false,
        message: "Bir seferde 1 ile 4 arasında görsel yükleyin.",
        status: 400,
      };
    }

    if (imageFiles.some((file) => !file.type.startsWith("image/"))) {
      return {
        success: false,
        message: "Yüklenen dosyaların tamamı görsel olmalıdır.",
        status: 400,
      };
    }

    if (imageFiles.some((file) => file.size > MAX_IMAGE_SIZE)) {
      return {
        success: false,
        message: "Her görsel en fazla 5 MB olabilir.",
        status: 400,
      };
    }

    uploadedImages = await uploadImages(imageFiles);

    const images = await prisma.lookbookImage.createManyAndReturn({
      data: uploadedImages,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/lookbook");

    return {
      success: true,
      message: "Lookbook görselleri başarıyla eklendi.",
      status: 201,
      result: images,
    };
  } catch (error) {
    console.error(error);

    if (uploadedImages.length > 0) {
      await deleteImages(uploadedImages.map((image) => image.publicId)).catch(
        console.error,
      );
    }

    return {
      success: false,
      message:
        error instanceof ImageUploadError
          ? error.message
          : "Lookbook görselleri eklenemedi.",
      status: 500,
    };
  }
};
