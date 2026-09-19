"use client";

import { createAbout } from "@/lib/actions/about/createAbout";
import type { AboutType, PortraitImageType } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import SelectedImagePreviews from "./SelectedImagePreviews";

interface AboutFormState {
  title: string;
  portraitImage: File | null;
  content: string;
  bio1: string;
  bio2: string;
  education: string;
  uzmanlik: string;
  applications: string;
  languages: string;
}

interface AboutFormProps {
  about: AboutType | null;
  portrait: PortraitImageType | null;
}

const AboutForm = ({ about, portrait }: AboutFormProps) => {
  const router = useRouter();
  const [form, setForm] = useState<AboutFormState>({
    title: about?.title ?? "",
    portraitImage: null,
    content: about?.content ?? "",
    bio1: about?.bio1 ?? "",
    bio2: about?.bio2 ?? "",
    education: about?.education ?? "",
    uzmanlik: about?.uzmanlik ?? "",
    applications: about?.applications ?? "",
    languages: about?.languages ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  };

  const handlePortraitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const portraitImage = event.currentTarget.files?.[0] ?? null;
    setForm((previousForm) => ({ ...previousForm, portraitImage }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("title", form.title);
    formData.set("content", form.content);
    formData.set("bio1", form.bio1);
    formData.set("bio2", form.bio2);
    formData.set("education", form.education);
    formData.set("uzmanlik", form.uzmanlik);
    formData.set("applications", form.applications);
    formData.set("languages", form.languages);
    if (form.portraitImage) formData.set("portraitImage", form.portraitImage);

    try {
      const response = await createAbout(formData);
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    } catch {
      toast.error("Bilgiler kaydedilirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "rounded-[6px] border border-[#f2ede433] bg-[#16140f] px-3.5 py-3.25 text-sm text-[#f2ede4] outline-none";
  const textareaClass =
    "resize-y rounded-[6px] border border-[#f2ede4] bg-[#16140f] px-3.5 py-3.25 text-[15px] leading-normal text-[#f2ede4]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6.5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#f2ede480]">Bölüm Etiketi</span>
          <input name="title" value={form.title} onChange={handleChange} required type="text" className={inputClass} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#f2ede480]">Portre Görseli</span>
          <input name="portraitImage" onChange={handlePortraitChange} type="file" accept="image/*" className={inputClass} />
          <span className="text-xs text-[#f2ede480]">
            {form.portraitImage?.name ?? (portrait ? "Mevcut portre korunacak" : "Henüz portre seçilmedi")}
          </span>
          {form.portraitImage ? (
            <SelectedImagePreviews
              files={[form.portraitImage]}
              className="mt-1 grid max-w-40 grid-cols-1"
            />
          ) : portrait ? (
            <div className="mt-1 max-w-40 overflow-hidden rounded-[8px] border border-[#f2ede424] bg-[#0f0e0c]">
              <div
                role="img"
                aria-label="Mevcut portre önizlemesi"
                className="aspect-3/4 bg-cover bg-center"
                style={{ backgroundImage: `url(${portrait.imageUrl})` }}
              />
              <div className="px-2.5 py-2 text-[11px] text-[#f2ede480]">
                Mevcut portre
              </div>
            </div>
          ) : null}
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#f2ede480]">Ana cümle (büyük başlık)</span>
        <textarea name="content" value={form.content} onChange={handleChange} required rows={4} className={textareaClass} />
      </label>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#f2ede480]">Biyografi — 1. paragraf</span>
          <textarea name="bio1" value={form.bio1} onChange={handleChange} required rows={6} className={textareaClass} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#f2ede480]">Biyografi — 2. paragraf</span>
          <textarea name="bio2" value={form.bio2} onChange={handleChange} required rows={6} className={textareaClass} />
        </label>
      </div>

      <div>
        <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-[#f2ede480]">Künye Alanları</div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["education", "Eğitim", form.education],
            ["uzmanlik", "Uzmanlık", form.uzmanlik],
            ["applications", "Araçlar", form.applications],
            ["languages", "Diller", form.languages],
          ].map(([name, label, value]) => (
            <label key={name} className="rounded-[8px] border border-[#f2ede424] p-3.5">
              <span className="inline-block w-full border-b border-b-[#f2ede426] pb-2 text-[11px] uppercase tracking-[0.14em] text-main">{label}</span>
              <textarea name={name} value={value} onChange={handleChange} required rows={5} className="w-full resize-y border-none bg-transparent p-0 pt-2.5 text-[13px] leading-normal text-[#f2ede4] outline-none" />
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-stretch sm:justify-end">
        <button type="submit" disabled={isSubmitting} className="w-full cursor-pointer rounded-full border-none bg-main px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f0e0c] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
          {isSubmitting ? "Kaydediliyor..." : "Güncelle"}
        </button>
      </div>
    </form>
  );
};

export default AboutForm;
