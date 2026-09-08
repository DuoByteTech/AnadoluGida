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
  if (!productId) {
    throw new Error("PRODUCT_ID_REQUIRED");
  }

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
  validateImageFile(file);

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
  if (!productId) {
    throw new Error("PRODUCT_ID_REQUIRED");
  }

  const imageFiles = Array.from(files || []);

  if (imageFiles.length === 0) {
    return [];
  }

  /*
   * Tüm dosyaları upload
   * başlamadan önce doğrula.
   *
   * Böylece örneğin 4 görselden
   * üçüncüsü geçersizse ilk iki
   * görsel gereksiz yere R2'ye
   * yüklenmez.
   */
  imageFiles.forEach(validateImageFile);

  return Promise.all(
    imageFiles.map((file) =>
      uploadProductImage({
        file,
        productId,
      }),
    ),
  );
};

export const deleteProductImagesFromR2 = async ({ productId, objectKeys }) => {
  if (!productId) {
    throw new Error("PRODUCT_ID_REQUIRED");
  }

  const keys = Array.from(objectKeys || []).filter(Boolean);

  if (keys.length === 0) {
    return true;
  }

  const { data, error } = await supabase.functions.invoke(
    "delete-product-images",
    {
      body: {
        productId,

        objectKeys: keys,
      },
    },
  );

  if (error) {
    throw error;
  }

  if (data?.success !== true) {
    throw new Error(data?.error || "R2_DELETE_FAILED");
  }

  return true;
};
