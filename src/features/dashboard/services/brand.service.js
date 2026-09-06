import { supabase } from "@/lib/supabase/client";

const mapBrand = (brand) => ({
  id: brand.id,
  name: brand.name,
  slug: brand.slug,
  isActive: brand.is_active,
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
      is_active,
      created_at,
      updated_at,
      products(count)
    `,
    )
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
      is_active,
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

export const createBrand = async ({ name, isActive = true }) => {
  const { data, error } = await supabase
    .from("brands")
    .insert({
      name: name.trim(),
      is_active: isActive,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapBrand(data);
};

export const updateBrand = async (id, { name, isActive = true }) => {
  if (!id) {
    throw new Error("BRAND_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("brands")
    .update({
      name: name.trim(),
      is_active: isActive,
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
