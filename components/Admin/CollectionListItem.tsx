"use client";

import { deleteCollection } from "@/lib/actions/collection/deleteCollection";
import type { CollectionType } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import AddEditCollectionSection from "./AddEditCollectionSection";

interface CollectionListItemProps {
  collection: CollectionType;
}

const CollectionListItem = ({ collection }: CollectionListItemProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const coverImage = collection.images[0];

  const handleDelete = async () => {
    if (!window.confirm(`“${collection.title}” koleksiyonu silinsin mi?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await deleteCollection(collection.id);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="grid min-w-[720px] grid-cols-[56px_minmax(180px,1fr)_170px_100px_150px] items-center gap-3.5 border-b border-[#f2ede466] px-1 py-3.5">
        <div
          className="aspect-4/5 w-11 rounded-[3px] bg-[#f2ede414] bg-cover bg-center"
          style={
            coverImage
              ? { backgroundImage: `url(${coverImage.imageUrl})` }
              : undefined
          }
        />

        <div className="min-w-0">
          <div className="overflow-hidden text-[15px] text-ellipsis whitespace-nowrap">
            {collection.title}
          </div>
          <div className="mt-0.75 overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-[#f2ede480]">
            <span>{collection.year}</span>
            {" · "}
            <span>{collection.images.length} görsel</span>
          </div>
        </div>

        <span className="text-xs text-[#f2ede4a6]">{collection.category}</span>

        <span>
          <span className="rounded-full bg-[#d9b26f2e] px-2.5 py-1.25 text-[10px] tracking-[0.12em] whitespace-nowrap text-main uppercase">
            Yayında
          </span>
        </span>

        <div className="flex justify-end gap-3.5 text-[11px] tracking-widest uppercase">
          <button
            onClick={() => setIsEditing(true)}
            type="button"
            className="cursor-pointer text-[#f2ede4bf]"
          >
            Düzenle
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            type="button"
            className="cursor-pointer text-[#f2ede466] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Siliniyor" : "Sil"}
          </button>
        </div>
      </div>

      {isEditing && (
        <AddEditCollectionSection
          collection={collection}
          setOpenAddSection={setIsEditing}
        />
      )}
    </>
  );
};

export default CollectionListItem;
