import { supabase } from "@/lib/supabase/client";
import { getR2PublicUrl } from "@/lib/storage/r2/r2.utils";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

const validateImageFile = (file) => {
  if (!(file instanceof File)) {
    throw new Error("INVALID_IMAGE_FILE");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("UNSUPPORTED_IMAGE_TYPE");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("IMAGE_TOO_LARGE");
  }
};

export const createProductImageUpload = async ({ file, productId }) => {
  validateImageFile(file);

  const { data, error } = await supabase.functions.invoke(
    "create-product-image-upload",
    {
      body: {
        productId,
        contentType: file.type,
      },
    },
  );

  if (error) {
    throw error;
  }

  if (!data?.uploadUrl || !data?.key) {
    throw new Error("UPLOAD_URL_NOT_RETURNED");
  }

  return data;
};

export const uploadProductImage = async ({ file, productId }) => {
  const upload = await createProductImageUpload({
    file,
    productId,
  });

  const response = await fetch(upload.uploadUrl, {
    method: "PUT",

    headers: {
      "Content-Type": file.type,
    },

    body: file,
  });

  if (!response.ok) {
    throw new Error(`R2_UPLOAD_FAILED_${response.status}`);
  }

  return {
    key: upload.key,
    url: getR2PublicUrl(upload.key),
    contentType: file.type,
    size: file.size,
  };
};

export const uploadProductImages = async ({ files, productId }) => {
  const imageFiles = Array.from(files || []);

  if (imageFiles.length === 0) {
    return [];
  }

  return Promise.all(
    imageFiles.map((file) =>
      uploadProductImage({
        file,
        productId,
      }),
    ),
  );
};
