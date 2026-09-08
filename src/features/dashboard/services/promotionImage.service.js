import { supabase } from "@/lib/supabase/client";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const validateImage = (file) => {
  if (!file) {
    throw new Error("PROMOTION_IMAGE_REQUIRED");
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("PROMOTION_IMAGE_TYPE_NOT_ALLOWED");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("PROMOTION_IMAGE_TOO_LARGE");
  }
};

export const createPromotionImageUpload = async ({ promotionId, file }) => {
  if (!promotionId) {
    throw new Error("PROMOTION_ID_REQUIRED");
  }

  validateImage(file);

  const { data, error } = await supabase.functions.invoke(
    "create-promotion-image-upload",
    {
      body: {
        promotionId,
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      },
    },
  );

  if (error) {
    throw error;
  }

  if (!data?.uploadUrl || !data?.objectKey) {
    throw new Error("PROMOTION_IMAGE_UPLOAD_URL_INVALID");
  }

  return {
    uploadUrl: data.uploadUrl,
    objectKey: data.objectKey,
  };
};

export const uploadPromotionImage = async ({ promotionId, file }) => {
  validateImage(file);

  const { uploadUrl, objectKey } = await createPromotionImageUpload({
    promotionId,
    file,
  });

  const response = await fetch(uploadUrl, {
    method: "PUT",

    headers: {
      "Content-Type": file.type,
    },

    body: file,
  });

  if (!response.ok) {
    throw new Error("PROMOTION_IMAGE_UPLOAD_FAILED");
  }

  return {
    objectKey,
    contentType: file.type,
    fileSize: file.size,
  };
};

export const deletePromotionImage = async ({ promotionId, objectKey }) => {
  if (!promotionId) {
    throw new Error("PROMOTION_ID_REQUIRED");
  }

  if (!objectKey) {
    throw new Error("PROMOTION_IMAGE_OBJECT_KEY_REQUIRED");
  }

  const { data, error } = await supabase.functions.invoke(
    "delete-promotion-image",
    {
      body: {
        promotionId,
        objectKey,
      },
    },
  );

  if (error) {
    throw error;
  }

  if (!data?.success) {
    throw new Error("PROMOTION_IMAGE_DELETE_FAILED");
  }

  return data;
};
