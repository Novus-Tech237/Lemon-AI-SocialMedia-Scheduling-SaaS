import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

/**
 * Uploads an image to Cloudinary under `images/<userId>/`.
 * Returns the same `{ url, key }` shape the rest of the app persists:
 *  - `url` is the public secure URL
 *  - `key` is the Cloudinary public_id (use it to delete/transform later)
 */
export async function uploadImage(
  file: File,
  userId: string,
): Promise<{ url: string; key: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const publicId = `${Date.now()}-${sanitizeFileName(file.name)}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `images/${userId}`,
          public_id: publicId,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error("Cloudinary upload failed"));
          }
          resolve({ url: result.secure_url, key: result.public_id });
        },
      )
      .end(buffer);
  });
}

export { cloudinary };
