import { supabase } from "@/lib/supabase/client";

const mapSubCategory = (subcategory) => ({
  id: subcategory.id,
  categoryId: subcategory.category_id,
  name: subcategory.name,
  slug: subcategory.slug,
});

const mapCategory = (category) => {
  const subcategories = (category.subcategories || [])
    .filter((subcategory) => subcategory.is_active)
    .map(mapSubCategory)
    .sort((a, b) => a.name.localeCompare(b.name, "de"));

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    subcategories,
  };
};

const mapBrand = (brand) => ({
  id: brand.id,
  name: brand.name,
  slug: brand.slug,
});

export const getShopCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      is_active,

      subcategories (
        id,
        category_id,
        name,
        slug,
        is_active
      )
    `,
    )
    .eq("is_active", true)
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data || [])
    .map(mapCategory)
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
};

export const getShopBrands = async () => {
  const { data, error } = await supabase
    .from("brands")
    .select(
      `
      id,
      name,
      slug,
      is_active
    `,
    )
    .eq("is_active", true)
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data || []).map(mapBrand);
};

export const getShopFilters = async () => {
  const [categories, brands] = await Promise.all([
    getShopCategories(),
    getShopBrands(),
  ]);

  return {
    categories,
    brands,
  };
};
