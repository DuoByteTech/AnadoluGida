import { supabase } from "@/lib/supabase/client";

import { getR2PublicUrl } from "@/lib/storage/r2/r2.utils";

const mapProductImage = (image) => ({
  id: image.id,
  productId: image.product_id,
  objectKey: image.object_key,
  url: getR2PublicUrl(image.object_key),
  contentType: image.content_type,
  fileSize: image.file_size,
  sortOrder: image.sort_order,
  isPrimary: image.is_primary,
  createdAt: image.created_at,
  updatedAt: image.updated_at,
});

const mapProduct = (product) => {
  const images = (product.product_images || [])
    .map(mapProductImage)
    .sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) {
        return -1;
      }

      if (!a.isPrimary && b.isPrimary) {
        return 1;
      }

      return a.sortOrder - b.sortOrder;
    });

  return {
    id: product.id,

    categoryId: product.category_id,
    category: product.categories?.name ?? "",

    subcategoryId: product.subcategory_id,
    subcategory: product.subcategories?.name ?? "",

    brandId: product.brand_id,
    brand: product.brands?.name ?? "",

    name: product.name,
    slug: product.slug,

    price: Number(product.price),

    discountPercentage: Number(product.discount_percentage ?? 0),

    badge: product.badge ?? "",
    color: product.color ?? "",

    isActive: product.is_active,

    createdAt: product.created_at,
    updatedAt: product.updated_at,

    images,

    image: images[0]?.url ?? null,
  };
};

const PRODUCT_SELECT = `
  id,
  category_id,
  subcategory_id,
  brand_id,
  name,
  slug,
  price,
  discount_percentage,
  is_active,
  created_at,
  updated_at,

  categories (
    id,
    name
  ),

  subcategories (
    id,
    name
  ),

  brands (
    id,
    name
  ),

  product_images (
    id,
    product_id,
    object_key,
    content_type,
    file_size,
    sort_order,
    is_primary,
    created_at,
    updated_at
  )
`;

const PRODUCT_IMAGE_SELECT = `
  id,
  product_id,
  object_key,
  content_type,
  file_size,
  sort_order,
  is_primary,
  created_at,
  updated_at
`;

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data || []).map(mapProduct);
};

export const getProductById = async (id) => {
  if (!id) {
    throw new Error("PRODUCT_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapProduct(data);
};

export const createProduct = async ({
  categoryId,
  subcategoryId = null,
  brandId = null,
  name,
  price,
  discountPercentage = 0,
  isActive = true,
}) => {
  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: categoryId,

      subcategory_id: subcategoryId || null,

      brand_id: brandId || null,

      name: name.trim(),

      price: Number(price),

      discount_percentage: Number(discountPercentage) || 0,

      is_active: isActive,
    })
    .select(PRODUCT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return mapProduct(data);
};

export const updateProduct = async (
  id,
  {
    categoryId,
    subcategoryId = null,
    brandId = null,
    name,
    price,
    discountPercentage = 0,
    isActive = true,
  },
) => {
  if (!id) {
    throw new Error("PRODUCT_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      category_id: categoryId,

      subcategory_id: subcategoryId || null,

      brand_id: brandId || null,

      name: name.trim(),

      price: Number(price),

      discount_percentage: Number(discountPercentage) || 0,

      is_active: isActive,
    })
    .eq("id", id)
    .select(PRODUCT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return mapProduct(data);
};

export const createProductImages = async ({
  productId,
  images,
  startSortOrder = 0,
  makeFirstPrimary = false,
}) => {
  if (!productId) {
    throw new Error("PRODUCT_ID_REQUIRED");
  }

  const imageList = Array.from(images || []);

  if (imageList.length === 0) {
    return [];
  }

  const rows = imageList.map((image, index) => ({
    product_id: productId,

    object_key: image.key,

    content_type: image.contentType || null,

    file_size: image.size ?? null,

    sort_order: startSortOrder + index,

    is_primary: makeFirstPrimary && index === 0,
  }));

  const { data, error } = await supabase
    .from("product_images")
    .insert(rows)
    .select(PRODUCT_IMAGE_SELECT);

  if (error) {
    throw error;
  }

  return (data || []).map(mapProductImage);
};

export const deleteProductImageRecord = async (imageId) => {
  if (!imageId) {
    throw new Error("PRODUCT_IMAGE_ID_REQUIRED");
  }

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    throw error;
  }

  return true;
};

export const deleteProductImageRecords = async (imageIds) => {
  const ids = Array.from(imageIds || []).filter(Boolean);

  if (ids.length === 0) {
    return true;
  }

  const { error } = await supabase
    .from("product_images")
    .delete()
    .in("id", ids);

  if (error) {
    throw error;
  }

  return true;
};

export const normalizeProductImages = async (productId) => {
  if (!productId) {
    throw new Error("PRODUCT_ID_REQUIRED");
  }

  const { data: images, error } = await supabase
    .from("product_images")
    .select(
      `
      id,
      sort_order,
      created_at
    `,
    )
    .eq("product_id", productId)
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  const imageList = images || [];

  if (imageList.length === 0) {
    return true;
  }

  const results = await Promise.all(
    imageList.map((image, index) =>
      supabase
        .from("product_images")
        .update({
          sort_order: index,

          is_primary: index === 0,
        })
        .eq("id", image.id),
    ),
  );

  const updateError = results.find((result) => result.error)?.error;

  if (updateError) {
    throw updateError;
  }

  return true;
};

export const updateProductImageOrder = async ({
  imageId,
  sortOrder,
  isPrimary = false,
}) => {
  if (!imageId) {
    throw new Error("PRODUCT_IMAGE_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("product_images")
    .update({
      sort_order: Number(sortOrder),

      is_primary: Boolean(isPrimary),
    })
    .eq("id", imageId)
    .select(PRODUCT_IMAGE_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return mapProductImage(data);
};

export const getProductImages = async (productId) => {
  if (!productId) {
    throw new Error("PRODUCT_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("product_images")
    .select(PRODUCT_IMAGE_SELECT)
    .eq("product_id", productId)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data || []).map(mapProductImage).sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) {
      return -1;
    }

    if (!a.isPrimary && b.isPrimary) {
      return 1;
    }

    return a.sortOrder - b.sortOrder;
  });
};

export const deleteProduct = async (id) => {
  if (!id) {
    throw new Error("PRODUCT_ID_REQUIRED");
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};
