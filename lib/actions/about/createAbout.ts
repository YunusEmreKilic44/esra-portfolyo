"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import {
  deleteImages,
  ImageUploadError,
  uploadImages,
} from "@/services/uploadImages";
import { revalidatePath } from "next/cache";

const ABOUT_ID = "main";
const PORTRAIT_ID = "main";
const MAX_PORTRAIT_SIZE = 4 * 1024 * 1024;

const getTextField = (formData: FormData, field: string) => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

export const createAbout = async (formData: FormData) => {
  await requireAdmin();

  let uploadedPortrait: Awaited<ReturnType<typeof uploadImages>>[number] | null =
    null;

  try {
    const aboutData = {
      title: getTextField(formData, "title"),
      content: getTextField(formData, "content"),
      bio1: getTextField(formData, "bio1"),
      bio2: getTextField(formData, "bio2"),
      education: getTextField(formData, "education"),
      uzmanlik: getTextField(formData, "uzmanlik"),
      applications: getTextField(formData, "applications"),
      languages: getTextField(formData, "languages"),
    };

    if (Object.values(aboutData).some((value) => !value)) {
      return {
        success: false,
        message: "Lütfen tüm hakkında alanlarını doldurun.",
        status: 400,
        result: null,
      };
    }

    const portraitValue = formData.get("portraitImage");
    const portraitImage =
      portraitValue instanceof File && portraitValue.size > 0
        ? portraitValue
        : null;

    if (portraitImage && !portraitImage.type.startsWith("image/")) {
      return {
        success: false,
        message: "Portre dosyası geçerli bir görsel olmalıdır.",
        status: 400,
        result: null,
      };
    }

    if (portraitImage && portraitImage.size > MAX_PORTRAIT_SIZE) {
      return {
        success: false,
        message: "Portre görseli en fazla 4 MB olabilir.",
        status: 400,
        result: null,
      };
    }

    const [existingAbout, existingPortrait] = await Promise.all([
      prisma.about.findFirst(),
      prisma.portreImage.findFirst(),
    ]);

    uploadedPortrait = portraitImage
      ? (await uploadImages([portraitImage]))[0]
      : null;

    const result = await prisma.$transaction(async (tx) => {
      const about = existingAbout
        ? await tx.about.update({
            where: { id: existingAbout.id },
            data: aboutData,
          })
        : await tx.about.upsert({
            where: { id: ABOUT_ID },
            update: aboutData,
            create: {
              id: ABOUT_ID,
              ...aboutData,
            },
          });

      let portrait = existingPortrait;

      if (uploadedPortrait) {
        portrait = existingPortrait
          ? await tx.portreImage.update({
              where: { id: existingPortrait.id },
              data: uploadedPortrait,
            })
          : await tx.portreImage.upsert({
              where: { id: PORTRAIT_ID },
              update: uploadedPortrait,
              create: {
                id: PORTRAIT_ID,
                ...uploadedPortrait,
              },
            });
      }

      return { about, portrait };
    });

    const savedPortrait = uploadedPortrait;
    uploadedPortrait = null;

    if (existingPortrait && savedPortrait) {
      await deleteImages([existingPortrait.publicId]).catch(console.error);
    }

    revalidatePath("/");
    revalidatePath("/admin/about");

    return {
      success: true,
      message: "Hakkında bilgileri başarıyla güncellendi.",
      status: 200,
      result,
    };
  } catch (error) {
    console.error(error);

    if (uploadedPortrait) {
      await deleteImages([uploadedPortrait.publicId]).catch(console.error);
    }

    return {
      success: false,
      message:
        error instanceof ImageUploadError
          ? error.message
          : "Hakkımda bilgileri güncellenemedi.",
      status: 500,
      result: null,
    };
  }
};
