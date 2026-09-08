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
});

const sortProductImages = (images = []) => {
  return [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) {
      return -1;
    }

    if (!a.isPrimary && b.isPrimary) {
      return 1;
    }

    return a.sortOrder - b.sortOrder;
  });
};

const mapProduct = (product) => {
  const images = sortProductImages(
    (product.product_images || []).map(mapProductImage),
  );

  const price = Number(product.price) || 0;

  const discountPercentage = Number(product.discount_percentage) || 0;

  const isDiscounted = discountPercentage > 0;

  const finalPrice = isDiscounted
    ? Number((price * (1 - discountPercentage / 100)).toFixed(2))
    : price;

  return {
    id: product.id,

    name: product.name,
    slug: product.slug,

    price,
    finalPrice,

    discountPercentage,
    isDiscounted,
    hasDiscount: isDiscounted,

    isActive: product.is_active,

    categoryId: product.category_id,
    category: product.categories?.name ?? "",
    categorySlug: product.categories?.slug ?? "",

    subcategoryId: product.subcategory_id,
    subcategory: product.subcategories?.name ?? "",
    subcategorySlug: product.subcategories?.slug ?? "",

    brandId: product.brand_id,
    brand: product.brands?.name ?? "",
    brandSlug: product.brands?.slug ?? "",

    images,

    image: images[0]?.url ?? null,

    imageUrls: images.map((image) => image.url).filter(Boolean),
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

  categories (
    id,
    name,
    slug
  ),

  subcategories (
    id,
    name,
    slug
  ),

  brands (
    id,
    name,
    slug
  ),

  product_images (
    id,
    product_id,
    object_key,
    content_type,
    file_size,
    sort_order,
    is_primary
  )
`;

export const getShopProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data || []).map(mapProduct);
};

export const getShopProductBySlug = async (slug) => {
  if (!slug) {
    throw new Error("PRODUCT_SLUG_REQUIRED");
  }

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapProduct(data);
};

export const getRelatedProducts = async ({
  productId,
  categoryId,
  limit = 6,
}) => {
  if (!productId) {
    throw new Error("PRODUCT_ID_REQUIRED");
  }

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .neq("id", productId);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query
    .order("name", {
      ascending: true,
    })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data || []).map(mapProduct);
};
