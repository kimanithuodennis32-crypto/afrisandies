const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export const cloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export class CloudinaryUploadError extends Error {}

/**
 * Uploads a file straight from the browser to Cloudinary using an unsigned
 * upload preset — no backend involvement, no API secret exposed client-side.
 * Returns the hosted image URL.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!cloudinaryConfigured) {
    throw new CloudinaryUploadError(
      "Cloudinary isn't configured yet — set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET!);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new CloudinaryUploadError(body?.error?.message ?? `Upload failed (${res.status})`);
  }

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}

/**
 * For Cloudinary-hosted images, asks Cloudinary for a resized, compressed copy
 * (much faster on mobile data). Other URLs are returned unchanged.
 */
export function optimizedImageUrl(url: string, width = 800): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/w_${width},c_limit,q_auto,f_auto/`);
}
