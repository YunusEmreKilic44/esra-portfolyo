"use client";

import { useEffect, useState } from "react";

const FilePreview = ({ file }: { file: File }) => {
  const [previewUrl] = useState(() => URL.createObjectURL(file));

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div className="overflow-hidden rounded-[8px] border border-[#f2ede424] bg-[#0f0e0c]">
      <div
        role="img"
        aria-label={`${file.name} önizlemesi`}
        className="aspect-3/4 bg-[#f2ede412] bg-cover bg-center"
        style={{ backgroundImage: `url(${previewUrl})` }}
      />
      <div className="truncate px-2.5 py-2 text-[11px] text-[#f2ede480]">
        {file.name}
      </div>
    </div>
  );
};

interface SelectedImagePreviewsProps {
  files: File[];
  className?: string;
}

const SelectedImagePreviews = ({
  files,
  className = "grid grid-cols-2 gap-2.5 sm:grid-cols-4",
}: SelectedImagePreviewsProps) => {
  if (files.length === 0) return null;

  return (
    <div className={className}>
      {files.map((file, index) => (
        <FilePreview
          key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
          file={file}
        />
      ))}
    </div>
  );
};

export default SelectedImagePreviews;
