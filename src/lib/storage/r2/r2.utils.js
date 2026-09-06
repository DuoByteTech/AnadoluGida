const R2_PUBLIC_BASE_URL = import.meta.env.VITE_R2_PUBLIC_BASE_URL;

export const getR2PublicUrl = (objectKey) => {
  if (!objectKey) {
    return null;
  }

  if (!R2_PUBLIC_BASE_URL) {
    throw new Error("VITE_R2_PUBLIC_BASE_URL is not configured");
  }

  const baseUrl = R2_PUBLIC_BASE_URL.replace(/\/+$/, "");

  const cleanKey = objectKey.replace(/^\/+/, "");

  return `${baseUrl}/${cleanKey}`;
};
