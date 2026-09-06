import { supabase } from "@/lib/supabase/client";

const mapCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  isActive: category.is_active,
  sortOrder: category.sort_order,
  createdAt: category.created_at,
  updatedAt: category.updated_at,
  productCount: category.products?.[0]?.count ?? 0,
});

export const getCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      description,
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

  return (data || []).map(mapCategory);
};

export const getCategoryById = async (id) => {
  if (!id) {
    throw new Error("CATEGORY_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      description,
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

  return mapCategory(data);
};

export const createCategory = async ({
  name,
  slug,
  description = null,
  isActive = true,
  sortOrder = 0,
}) => {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: name.trim(),
      slug: slug.trim(),
      description: description?.trim() || null,
      is_active: isActive,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapCategory(data);
};

export const updateCategory = async (
  id,
  { name, slug, description = null, isActive = true, sortOrder = 0 },
) => {
  if (!id) {
    throw new Error("CATEGORY_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: name.trim(),
      slug: slug.trim(),
      description: description?.trim() || null,
      is_active: isActive,
      sort_order: sortOrder,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapCategory(data);
};

export const deleteCategory = async (id) => {
  if (!id) {
    throw new Error("CATEGORY_ID_REQUIRED");
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};
