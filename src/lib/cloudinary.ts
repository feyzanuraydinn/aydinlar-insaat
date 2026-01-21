import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteFromCloudinary(publicId: string | null | undefined): Promise<boolean> {
  if (!publicId) return false;

  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

export async function deleteMultipleFromCloudinary(publicIds: (string | null | undefined)[]): Promise<void> {
  const validIds = publicIds.filter((id): id is string => !!id);

  if (validIds.length === 0) return;

  await Promise.allSettled(validIds.map(id => deleteFromCloudinary(id)));
}

export { cloudinary };
