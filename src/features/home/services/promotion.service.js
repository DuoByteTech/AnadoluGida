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
});

const PROMOTION_SELECT = `
  id,
  title,
  description,
  image_object_key,
  created_at
`;

export const getActivePromotions = async () => {
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
