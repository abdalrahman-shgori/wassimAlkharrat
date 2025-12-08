import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param fileBuffer - The file buffer to upload
 * @param folder - Optional folder path in Cloudinary (default: 'services')
 * @returns Promise with the uploaded image URL
 */
export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  folder: string = "services"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `event-planner/${folder}`,
        resource_type: "image",
        // Optimize images automatically
        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Upload failed: No result returned"));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete an image from Cloudinary
 * @param imageUrl - The Cloudinary URL of the image to delete
 */
export async function deleteImageFromCloudinary(imageUrl: string): Promise<void> {
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");
    
    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL");
    }

    // Get the public_id (everything after upload/version/)
    const versionAndId = urlParts.slice(uploadIndex + 1).join("/");
    const publicId = versionAndId.split(".")[0]; // Remove file extension

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    // Don't throw - allow deletion to continue even if image deletion fails
  }
}

export default cloudinary;

