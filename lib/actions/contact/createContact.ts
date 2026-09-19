"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import type { ContactType } from "@/lib/types/types";
import { revalidatePath } from "next/cache";

interface ContactTypeProps {
  contactType: ContactType;
  contactId: string;
}

const SINGLETON_CONTACT_ID = "main";

export const createContact = async (data: ContactTypeProps) => {
  await requireAdmin();

  try {
    const contactData = {
      title: data.contactType.title.trim(),
      email: data.contactType.email.trim(),
      linkedin: data.contactType.linkedin.trim(),
    };

    if (Object.values(contactData).some((value) => !value)) {
      return { success: false, message: "Lütfen tüm iletişim alanlarını doldurun.", status: 400 };
    }

    const { contact, created } = await prisma.$transaction(async (tx) => {
      const existingContacts = await tx.contact.findMany({ select: { id: true } });
      if (existingContacts.length > 0) {
        const primaryContact = existingContacts.find((item) => item.id === data.contactId) ?? existingContacts[0];
        const updatedContact = await tx.contact.update({ where: { id: primaryContact.id }, data: contactData });
        await tx.contact.deleteMany({ where: { id: { not: primaryContact.id } } });
        return { contact: updatedContact, created: false };
      }

      const newContact = await tx.contact.upsert({
        where: { id: SINGLETON_CONTACT_ID },
        update: contactData,
        create: { id: SINGLETON_CONTACT_ID, ...contactData },
      });
      return { contact: newContact, created: true };
    });

    revalidatePath("/");
    revalidatePath("/admin/contact");

    return {
      success: true,
      message: "İletişim bilgileri başarıyla güncellendi.",
      status: created ? 201 : 200,
      result: contact,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "İletişim bilgileri kaydedilemedi.", status: 500, result: null };
  }
};
