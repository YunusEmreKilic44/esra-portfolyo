import cloudinary from "@/lib/cloudinary";

interface UploadImageResult {
  publicId: string;
  imageUrl: string;
}

interface CloudinaryUploadError {
  message?: string;
  http_code?: number;
}

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

const normalizeUploadError = (error: CloudinaryUploadError | undefined) => {
  if (error?.http_code === 401 || error?.http_code === 403) {
    return new ImageUploadError(
      "Görsel servisi yükleme isteğini reddetti. Cloudinary API anahtarının upload/create iznini kontrol edin.",
    );
  }

  return new ImageUploadError(
    error?.message || "Görsel yüklenirken beklenmeyen bir hata oluştu.",
  );
};

export const uploadImages = async (
  images: File[],
): Promise<UploadImageResult[]> => {
  if (images.length < 1 || images.length > 4) {
    throw new Error("Please upload between 1 and 4 images.");
  }

  return Promise.all(
    images.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise<UploadImageResult>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "esra-portfolyo",
            format: "webp",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              reject(normalizeUploadError(error));
              return;
            }

            resolve({
              imageUrl: result.secure_url,
              publicId: result.public_id,
            });
          },
        );

        stream.end(buffer);
      });
    }),
  );
};

export const deleteImages = async (publicIds: string[]) => {
  await Promise.all(
    publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)),
  );
};
