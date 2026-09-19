"use client";

import { saveCollection } from "@/lib/actions/collection/saveCollection";
import type { CollectionType } from "@/lib/types/types";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import SelectedImagePreviews from "./SelectedImagePreviews";

interface AddEditCollectionSectionProps {
  setOpenAddSection: (open: boolean) => void;
  collection?: CollectionType;
}

const AddEditCollectionSection = ({
  setOpenAddSection,
  collection,
}: AddEditCollectionSectionProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: collection?.title ?? "",
    category: collection?.category ?? "",
    year: collection?.year ?? "",
    material: collection?.material ?? "",
    description: collection?.description ?? "",
    detail: collection?.detail ?? "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImages = Array.from(event.currentTarget.files ?? []);

    if (selectedImages.length > 4) {
      toast.error("En fazla 4 görsel seçebilirsiniz.");
      event.currentTarget.value = "";
      return;
    }

    setImages(selectedImages);
  };

  const toggleExistingImage = (imageId: string) => {
    setRemovedImageIds((currentIds) =>
      currentIds.includes(imageId)
        ? currentIds.filter((id) => id !== imageId)
        : [...currentIds, imageId],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();

    if (collection) {
      formData.set("id", collection.id);
    }

    Object.entries(form).forEach(([field, value]) => formData.set(field, value));
    images.forEach((image) => formData.append("images", image));
    removedImageIds.forEach((imageId) =>
      formData.append("removedImageIds", imageId),
    );

    try {
      const response = await saveCollection(formData);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      setOpenAddSection(false);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6.5 rounded-[10px] border border-main bg-[#16140f] p-4 sm:p-5.5"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="font-heading text-[24px]">
          {collection ? "Koleksiyonu düzenle" : "Yeni koleksiyon ekle"}
        </div>
        <button
          type="button"
          className="cursor-pointer text-[18px] text-[#f2ede480]"
          onClick={() => setOpenAddSection(false)}
          aria-label="Formu kapat"
        >
          <X />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[11px] tracking-[0.14em] text-[#f2ede480] uppercase">
            Ürün / Koleksiyon Adı
          </span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            type="text"
            className="rounded-[6px] border border-[#f2ede433] bg-[#0f0e0c] px-3.5 py-3.25 text-sm text-[#f2ede4] outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[11px] tracking-[0.14em] text-[#f2ede480] uppercase">
            Kategori
          </span>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            type="text"
            className="rounded-[6px] border border-[#f2ede433] bg-[#0f0e0c] px-3.5 py-3.25 text-sm text-[#f2ede4] outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[11px] tracking-[0.14em] text-[#f2ede480] uppercase">
            Yıl
          </span>
          <input
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            type="text"
            className="rounded-[6px] border border-[#f2ede433] bg-[#0f0e0c] px-3.5 py-3.25 text-sm text-[#f2ede4] outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[11px] tracking-[0.14em] text-[#f2ede480] uppercase">
            Malzeme
          </span>
          <input
            name="material"
            value={form.material}
            onChange={handleChange}
            required
            type="text"
            className="rounded-[6px] border border-[#f2ede433] bg-[#0f0e0c] px-3.5 py-3.25 text-sm text-[#f2ede4] outline-none"
          />
        </label>
      </div>

      <label className="mt-4.5 flex flex-col gap-2">
        <span className="text-[11px] tracking-[0.14em] text-[#f2ede480] uppercase">
          Kısa açıklama (liste satırı)
        </span>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          type="text"
          className="rounded-[6px] border border-[#f2ede433] bg-[#0f0e0c] px-3.5 py-3.25 text-sm text-[#f2ede4] outline-none"
        />
      </label>

      <label className="mt-4.5 flex flex-col gap-2">
        <span className="text-[11px] tracking-[0.14em] text-[#f2ede480] uppercase">
          Detay Metni
        </span>
        <textarea
          name="detail"
          value={form.detail}
          onChange={handleChange}
          required
          className="resize-y rounded-[6px] border border-[#f2ede433] bg-[#0f0e0c] px-3.5 py-3.25 text-sm text-[#f2ede4] outline-none"
        />
      </label>

      <div className="mt-4.5">
        <div className="mb-2.5 text-[11px] tracking-[0.14em] text-[#f2ede480] uppercase">
          Görseller {collection && "— Yeni görseller mevcut galeriye eklenir"}
        </div>

        {collection && collection.images.length > 0 && (
          <div className="mb-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {collection.images.map((image) => {
              const isRemoved = removedImageIds.includes(image.id);

              return (
                <div
                  key={image.id}
                  className={`relative aspect-3/4 overflow-hidden rounded-[6px] border bg-cover bg-center transition-opacity ${
                    isRemoved
                      ? "border-red-400/70 opacity-45"
                      : "border-[#f2ede424]"
                  }`}
                  style={{ backgroundImage: `url(${image.imageUrl})` }}
                >
                  <button
                    type="button"
                    aria-pressed={isRemoved}
                    onClick={() => toggleExistingImage(image.id)}
                    className={`absolute right-2 top-2 cursor-pointer rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] shadow-lg ${
                      isRemoved
                        ? "bg-main text-[#0f0e0c]"
                        : "bg-[#0f0e0ce6] text-[#f2ede4]"
                    }`}
                  >
                    {isRemoved ? "Geri al" : "Sil"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="w-full rounded-[6px] border border-dashed border-[#f2ede440] bg-[#0f0e0c] p-3 text-xs text-[#f2ede4]"
        />
        {images.length > 0 && (
          <SelectedImagePreviews
            files={images}
            className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4"
          />
        )}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#f2ede424] pt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        <button
          onClick={() => setOpenAddSection(false)}
          type="button"
          className="w-full cursor-pointer rounded-full border border-[#f2ede44d] bg-transparent px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-[#f2ede4] uppercase sm:w-auto"
        >
          Vazgeç
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-full border-none bg-main px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-[#0f0e0c] uppercase disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
};

export default AddEditCollectionSection;
