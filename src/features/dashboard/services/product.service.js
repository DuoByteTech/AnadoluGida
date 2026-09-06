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
    description: product.description ?? "",

    price: Number(product.price),

    oldPrice: product.old_price !== null ? Number(product.old_price) : null,

    badge: product.badge ?? "",
    color: product.color ?? "",
    rating: Number(product.rating ?? 0),

    isDiscounted: product.is_discounted,
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
  description,
  price,
  old_price,
  badge,
  color,
  rating,
  is_discounted,
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
  description = null,
  price,
  oldPrice = null,
  badge = null,
  color = null,
  rating = 0,
  isDiscounted = false,
  isActive = true,
}) => {
  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: categoryId,

      subcategory_id: subcategoryId || null,

      brand_id: brandId || null,

      name: name.trim(),

      description: description?.trim() || null,

      price: Number(price),

      old_price: oldPrice !== null && oldPrice !== "" ? Number(oldPrice) : null,

      badge: badge?.trim() || null,

      color: color || null,

      rating: Number(rating || 0),

      is_discounted: isDiscounted,

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
    description = null,
    price,
    oldPrice = null,
    badge = null,
    color = null,
    rating = 0,
    isDiscounted = false,
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

      description: description?.trim() || null,

      price: Number(price),

      old_price: oldPrice !== null && oldPrice !== "" ? Number(oldPrice) : null,

      badge: badge?.trim() || null,

      color: color || null,

      rating: Number(rating || 0),

      is_discounted: isDiscounted,

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

export const createProductImages = async ({ productId, images }) => {
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

    // Bu kalıyor:
    // ürün görsellerinin kendi sırası.
    sort_order: index,

    is_primary: index === 0,
  }));

  const { data, error } = await supabase.from("product_images").insert(rows)
    .select(`
      id,
      product_id,
      object_key,
      content_type,
      file_size,
      sort_order,
      is_primary,
      created_at,
      updated_at
    `);

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
