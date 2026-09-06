import { supabase } from "@/lib/supabase/client";

const mapSubCategory = (item) => ({
  id: item.id,
  categoryId: item.category_id,
  categoryName: item.categories?.name ?? "",
  name: item.name,
  slug: item.slug,
  description: item.description ?? "",
  isActive: item.is_active,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
  productCount: item.products?.[0]?.count ?? 0,
});

export const getSubCategories = async () => {
  const { data, error } = await supabase
    .from("subcategories")
    .select(
      `
      id,
      category_id,
      name,
      slug,
      description,
      is_active,
      created_at,
      updated_at,
      categories (
        id,
        name
      ),
      products(count)
    `,
    )
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data || []).map(mapSubCategory);
};

export const getSubCategoryById = async (id) => {
  if (!id) {
    throw new Error("SUBCATEGORY_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("subcategories")
    .select(
      `
      id,
      category_id,
      name,
      slug,
      description,
      is_active,
      created_at,
      updated_at,
      categories (
        id,
        name
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapSubCategory(data);
};

export const createSubCategory = async ({
  categoryId,
  name,
  description = null,
  isActive = true,
}) => {
  const { data, error } = await supabase
    .from("subcategories")
    .insert({
      category_id: categoryId,
      name: name.trim(),
      description: description?.trim() || null,
      is_active: isActive,
    })
    .select(
      `
      id,
      category_id,
      name,
      slug,
      description,
      is_active,
      created_at,
      updated_at,
      categories (
        id,
        name
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return mapSubCategory(data);
};

export const updateSubCategory = async (
  id,
  { categoryId, name, description = null, isActive = true },
) => {
  if (!id) {
    throw new Error("SUBCATEGORY_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("subcategories")
    .update({
      category_id: categoryId,
      name: name.trim(),
      description: description?.trim() || null,
      is_active: isActive,
    })
    .eq("id", id)
    .select(
      `
      id,
      category_id,
      name,
      slug,
      description,
      is_active,
      created_at,
      updated_at,
      categories (
        id,
        name
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return mapSubCategory(data);
};

export const deleteSubCategory = async (id) => {
  if (!id) {
    throw new Error("SUBCATEGORY_ID_REQUIRED");
  }

  const { error } = await supabase.from("subcategories").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};
