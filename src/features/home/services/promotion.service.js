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

  sortOrder: promotion.sort_order ?? 0,
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
  sort_order,
  created_at
`;

export const getActivePromotions = async () => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("promotions")
    .select(PROMOTION_SELECT)
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gt.${now}`)
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
