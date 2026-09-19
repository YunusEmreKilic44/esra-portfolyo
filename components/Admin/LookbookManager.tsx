"use client";

import { createLookbookImages } from "@/lib/actions/lookbook/createLookbookImages";
import { deleteLookbookImage } from "@/lib/actions/lookbook/deleteLookbookImage";
import type { LookbookImageType } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import SelectedImagePreviews from "./SelectedImagePreviews";

interface LookbookManagerProps {
  images: LookbookImageType[];
}

const LookbookManager = ({ images }: LookbookManagerProps) => {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0);

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);

    if (files.length > 4) {
      toast.error("Bir seferde en fazla 4 görsel seçebilirsiniz.");
      event.currentTarget.value = "";
      return;
    }

    setSelectedImages(files);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedImages.length === 0) {
      toast.error("En az bir görsel seçin.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    selectedImages.forEach((image) => formData.append("images", image));

    try {
      const response = await createLookbookImages(formData);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      setSelectedImages([]);
      setInputKey((key) => key + 1);
      router.refresh();
    } catch {
      toast.error("Görseller yüklenirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (image: LookbookImageType) => {
    if (!window.confirm("Bu lookbook görseli silinsin mi?")) {
      return;
    }

    setDeletingId(image.id);

    try {
      const response = await deleteLookbookImage(image.id);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleUpload}
        className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end"
      >
        <input
          key={inputKey}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="w-full rounded-[6px] border border-[#f2ede433] bg-[#16140f] px-3 py-2 text-xs text-[#f2ede4] sm:max-w-sm"
        />
        <button
          type="submit"
          disabled={isUploading}
          className="w-full cursor-pointer rounded-full border-none bg-main px-5 py-3 text-[11px] font-semibold tracking-[0.12em] text-[#0f0e0c] uppercase disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isUploading ? "Yükleniyor..." : "+ Görsel Ekle"}
        </button>
      </form>

      {selectedImages.length > 0 && (
        <div className="mb-6 rounded-[10px] border border-main/50 bg-[#16140f] p-3 sm:p-4">
          <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-[#f2ede480]">
            Yüklenecek görseller
          </div>
          <SelectedImagePreviews files={selectedImages} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="overflow-hidden rounded-[8px] border border-[#f2ede424]"
          >
            <div
              className="aspect-3/4 bg-[#f2ede412] bg-cover bg-center"
              style={{ backgroundImage: `url(${image.imageUrl})` }}
            />
            <div className="flex items-center justify-between px-3 py-2.5 text-[11px] tracking-widest uppercase">
              <span className="text-[#f2ede480]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <button
                onClick={() => handleDelete(image)}
                disabled={deletingId === image.id}
                type="button"
                className="cursor-pointer text-[#f2ede480] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingId === image.id ? "Siliniyor" : "Sil"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="py-10 text-center text-sm text-[#f2ede473]">
          Henüz lookbook görseli eklenmedi.
        </div>
      )}
    </div>
  );
};

export default LookbookManager;
