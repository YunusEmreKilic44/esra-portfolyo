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

const getTextField = (formData: FormData, field: string) => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

export const saveCollection = async (formData: FormData) => {
  await requireAdmin();

  let uploadedImages: Awaited<ReturnType<typeof uploadImages>> = [];

  try {
    const collectionId = getTextField(formData, "id");
    const collectionData = {
      title: getTextField(formData, "title"),
      category: getTextField(formData, "category"),
      year: getTextField(formData, "year"),
      material: getTextField(formData, "material"),
      description: getTextField(formData, "description"),
      detail: getTextField(formData, "detail"),
    };

    if (Object.values(collectionData).some((value) => !value)) {
      return {
        success: false,
        message: "Lütfen tüm koleksiyon alanlarını doldurun.",
        status: 400,
      };
    }

    const imageFiles = formData
      .getAll("images")
      .filter((value): value is File => value instanceof File && value.size > 0);
    const removedImageIds = [
      ...new Set(
        formData
          .getAll("removedImageIds")
          .filter((value): value is string => typeof value === "string" && value.length > 0),
      ),
    ];

    if (imageFiles.length > 4) {
      return {
        success: false,
        message: "En fazla 4 koleksiyon görseli yükleyebilirsiniz.",
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

    const existingCollection = collectionId
      ? await prisma.collection.findUnique({
          where: { id: collectionId },
          include: { images: true },
        })
      : null;

    if (collectionId && !existingCollection) {
      return {
        success: false,
        message: "Güncellenecek koleksiyon bulunamadı.",
        status: 404,
      };
    }

    const imagesToDelete = existingCollection
      ? existingCollection.images.filter((image) =>
          removedImageIds.includes(image.id),
        )
      : [];

    if (removedImageIds.length !== imagesToDelete.length) {
      return {
        success: false,
        message: "Silinmek istenen görseller koleksiyona ait değil.",
        status: 400,
      };
    }

    if (!existingCollection && imageFiles.length === 0) {
      return {
        success: false,
        message: "Yeni koleksiyon için en az bir görsel yükleyin.",
        status: 400,
      };
    }

    if (
      existingCollection &&
      existingCollection.images.length - imagesToDelete.length + imageFiles.length === 0
    ) {
      return {
        success: false,
        message: "Koleksiyonda en az bir görsel bulunmalıdır.",
        status: 400,
      };
    }

    uploadedImages = imageFiles.length > 0 ? await uploadImages(imageFiles) : [];

    const collection = await prisma.$transaction(async (tx) => {
      if (existingCollection) {
        const hasImageChanges =
          uploadedImages.length > 0 || imagesToDelete.length > 0;

        return tx.collection.update({
          where: { id: existingCollection.id },
          data: {
            ...collectionData,
            ...(hasImageChanges && {
              images: {
                ...(imagesToDelete.length > 0 && {
                  deleteMany: { id: { in: imagesToDelete.map((image) => image.id) } },
                }),
                ...(uploadedImages.length > 0 && { create: uploadedImages }),
              },
            }),
          },
          include: { images: true },
        });
      }

      return tx.collection.create({
        data: {
          ...collectionData,
          images: { create: uploadedImages },
        },
        include: { images: true },
      });
    });

    uploadedImages = [];

    if (imagesToDelete.length > 0) {
      await deleteImages(imagesToDelete.map((image) => image.publicId)).catch(
        console.error,
      );
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/works");
    revalidatePath(`/tasarimlar/${collection.id}`);
    revalidatePath("/tasarimlar/[tasarimId]", "page");

    return {
      success: true,
      message: existingCollection
        ? "Koleksiyon başarıyla güncellendi."
        : "Koleksiyon başarıyla oluşturuldu.",
      status: existingCollection ? 200 : 201,
      result: collection,
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
          : "Koleksiyon kaydedilemedi.",
      status: 500,
    };
  }
};
