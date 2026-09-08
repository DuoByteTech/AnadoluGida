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

  createdAt: promotion.created_at,

  updatedAt: promotion.updated_at,
});

const PROMOTION_SELECT = `
  id,
  title,
  description,
  image_object_key,
  created_at,
  updated_at
`;

export const getPromotions = async () => {
  const { data, error } = await supabase
    .from("promotions")
    .select(PROMOTION_SELECT)
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
  { title, description = "", imageObjectKey = null },
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
