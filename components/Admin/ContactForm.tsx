"use client";

import { createContact } from "@/lib/actions/contact/createContact";
import type { ContactType } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ContactFormProps {
  contact: {
    success: boolean;
    message: string;
    status: number;
    result: (ContactType & { id: string }) | null;
  };
}

const ContactForm = ({ contact }: ContactFormProps) => {
  const router = useRouter();
  const { result } = contact;
  const [form, setForm] = useState({
    title: result?.title ?? "",
    email: result?.email ?? "",
    linkedin: result?.linkedin ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createContact({ contactType: form, contactId: result?.id ?? "" });
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      router.refresh();
    } catch {
      toast.error("İletişim bilgileri kaydedilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "rounded-[6px] border border-[#f2ede433] bg-[#16140f] px-3.5 py-3.25 text-sm text-[#f2ede4] outline-none";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <label className="flex flex-col gap-2 md:col-span-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#f2ede480]">Başlık</span>
        <input name="title" value={form.title} onChange={handleChange} required type="text" className={inputClass} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#f2ede480]">E-posta</span>
        <input name="email" value={form.email} onChange={handleChange} required type="email" className={inputClass} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#f2ede480]">LinkedIn</span>
        <input name="linkedin" value={form.linkedin} onChange={handleChange} required type="text" placeholder="linkedin.com/in/kullanici" className={inputClass} />
      </label>
      <div className="flex justify-stretch md:col-span-2 md:justify-end">
        <button type="submit" disabled={isSubmitting} className="w-full cursor-pointer rounded-full bg-main px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f0e0c] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
          {isSubmitting ? "Kaydediliyor..." : "Güncelle"}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
