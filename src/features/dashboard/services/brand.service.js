import { supabase } from "@/lib/supabase/client";

const mapBrand = (brand) => ({
  id: brand.id,
  name: brand.name,
  slug: brand.slug,
  description: brand.description ?? "",
  websiteUrl: brand.website_url ?? "",
  isActive: brand.is_active,
  sortOrder: brand.sort_order,
  createdAt: brand.created_at,
  updatedAt: brand.updated_at,
  productCount: brand.products?.[0]?.count ?? 0,
});

export const getBrands = async () => {
  const { data, error } = await supabase
    .from("brands")
    .select(
      `
      id,
      name,
      slug,
      description,
      website_url,
      is_active,
      sort_order,
      created_at,
      updated_at,
      products(count)
    `,
    )
    .order("sort_order", {
      ascending: true,
    })
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data || []).map(mapBrand);
};

export const getBrandById = async (id) => {
  if (!id) {
    throw new Error("BRAND_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("brands")
    .select(
      `
      id,
      name,
      slug,
      description,
      website_url,
      is_active,
      sort_order,
      created_at,
      updated_at
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapBrand(data);
};

export const createBrand = async ({
  name,
  slug,
  description = null,
  websiteUrl = null,
  isActive = true,
  sortOrder = 0,
}) => {
  const { data, error } = await supabase
    .from("brands")
    .insert({
      name: name.trim(),
      slug: slug.trim(),
      description: description?.trim() || null,
      website_url: websiteUrl?.trim() || null,
      is_active: isActive,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapBrand(data);
};

export const updateBrand = async (
  id,
  {
    name,
    slug,
    description = null,
    websiteUrl = null,
    isActive = true,
    sortOrder = 0,
  },
) => {
  if (!id) {
    throw new Error("BRAND_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("brands")
    .update({
      name: name.trim(),
      slug: slug.trim(),
      description: description?.trim() || null,
      website_url: websiteUrl?.trim() || null,
      is_active: isActive,
      sort_order: sortOrder,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapBrand(data);
};

export const deleteBrand = async (id) => {
  if (!id) {
    throw new Error("BRAND_ID_REQUIRED");
  }

  const { error } = await supabase.from("brands").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};
