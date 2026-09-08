import { supabase } from "@/lib/supabase/client";

import { getR2PublicUrl } from "@/lib/storage/r2/r2.utils";

const mapPromotion = (promotion) => ({
  id: promotion.id,
  title: promotion.title,
  description: promotion.description ?? "",
  imageObjectKey: promotion.image_object_key ?? null,
  image: promotion.image_object_key
    ? getR2PublicUrl(promotion.image_object_key)
    : null,
  linkUrl: promotion.link_url ?? "",
  discountPercentage: Number(promotion.discount_percentage) || 0,
  startsAt: promotion.starts_at ?? null,
  endsAt: promotion.ends_at ?? null,
  isActive: promotion.is_active,
  sortOrder: promotion.sort_order ?? 0,
  createdAt: promotion.created_at,
  updatedAt: promotion.updated_at,
});

const PROMOTION_SELECT = `
  id,
  title,
  description,
  image_object_key,
  link_url,
  discount_percentage,
  starts_at,
  ends_at,
  is_active,
  sort_order,
  created_at,
  updated_at
`;

export const getPromotions = async () => {
  const { data, error } = await supabase
    .from("promotions")
    .select(PROMOTION_SELECT)
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data || []).map(mapPromotion);
};

export const getPromotionById = async (id) => {
  if (!id) {
    throw new Error("PROMOTION_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("promotions")
    .select(PROMOTION_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapPromotion(data);
};

export const createPromotion = async ({
  title,
  description = "",
  imageObjectKey = null,
  linkUrl = "",
  discountPercentage = 0,
  startsAt = null,
  endsAt = null,
  isActive = true,
  sortOrder = 0,
}) => {
  if (!title?.trim()) {
    throw new Error("PROMOTION_TITLE_REQUIRED");
  }

  const { data, error } = await supabase
    .from("promotions")
    .insert({
      title: title.trim(),

      description: description?.trim() || null,

      image_object_key: imageObjectKey || null,

      link_url: linkUrl?.trim() || null,

      discount_percentage: Number(discountPercentage) || 0,

      starts_at: startsAt || null,

      ends_at: endsAt || null,

      is_active: Boolean(isActive),

      sort_order: Number(sortOrder) || 0,
    })
    .select(PROMOTION_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return mapPromotion(data);
};

export const updatePromotion = async (
  id,
  {
    title,
    description = "",
    imageObjectKey = null,
    linkUrl = "",
    discountPercentage = 0,
    startsAt = null,
    endsAt = null,
    isActive = true,
    sortOrder = 0,
  },
) => {
  if (!id) {
    throw new Error("PROMOTION_ID_REQUIRED");
  }

  if (!title?.trim()) {
    throw new Error("PROMOTION_TITLE_REQUIRED");
  }

  const { data, error } = await supabase
    .from("promotions")
    .update({
      title: title.trim(),

      description: description?.trim() || null,

      image_object_key: imageObjectKey || null,

      link_url: linkUrl?.trim() || null,

      discount_percentage: Number(discountPercentage) || 0,

      starts_at: startsAt || null,

      ends_at: endsAt || null,

      is_active: Boolean(isActive),

      sort_order: Number(sortOrder) || 0,
    })
    .eq("id", id)
    .select(PROMOTION_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return mapPromotion(data);
};

export const deletePromotion = async (id) => {
  if (!id) {
    throw new Error("PROMOTION_ID_REQUIRED");
  }

  const { error } = await supabase.from("promotions").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};
