import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer to Cloudinary.
 * @param buffer   - The file buffer (from multer memoryStorage)
 * @param folder   - Sub-folder under "uploads"  → "products" | "profile" | "images"
 * @param filename - Public ID (without extension)
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: "products" | "profile" | "images" | "categories",
  filename: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `uploads/${folder}`,
        public_id: filename,
        resource_type: "image",
        format: "webp",
        transformation: [{ quality: 90 }],
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

export default cloudinary;
