"use client";

import type { CollectionType } from "@/lib/types/types";
import { useState } from "react";
import AddEditCollectionSection from "./AddEditCollectionSection";
import CollectionListItem from "./CollectionListItem";

interface WorksManagerProps {
  collections: CollectionType[];
}

const WorksManager = ({ collections }: WorksManagerProps) => {
  const [openAddSection, setOpenAddSection] = useState(false);

  return (
    <div>
      <div className="mb-5.5 flex flex-wrap items-center justify-end gap-4">
        <button
          onClick={() => setOpenAddSection(true)}
          type="button"
          className="w-full cursor-pointer rounded-full border-none bg-main px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f0e0c] sm:w-auto"
        >
          + Yeni Ürün
        </button>
      </div>

      {openAddSection && (
        <AddEditCollectionSection setOpenAddSection={setOpenAddSection} />
      )}

      <div className="overflow-x-auto">
        <div className="flex min-w-[720px] flex-col border-t border-[#f2ede424]">
        <div className="grid grid-cols-[56px_minmax(180px,1fr)_170px_100px_150px] gap-3.5 border-b border-[#f2ede466] px-1 py-3 text-[10px] tracking-[0.14em] text-[#f2ede466] uppercase">
          <span>Görsel</span>
          <span>Ürün</span>
          <span>Kategori</span>
          <span>Durum</span>
          <span className="text-right">İşlem</span>
        </div>

        {collections.map((collection) => (
          <CollectionListItem key={collection.id} collection={collection} />
        ))}

        {collections.length === 0 && (
          <div className="py-8 text-center text-sm text-[#f2ede473]">
            Henüz koleksiyon eklenmedi.
          </div>
        )}
        </div>
      </div>

      <div className="mt-4 text-xs text-[#f2ede473]">
        {collections.length} ürün
      </div>
    </div>
  );
};

export default WorksManager;
