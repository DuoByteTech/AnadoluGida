import { supabase } from "@/lib/supabase/client";
import { getProducts } from "./product.service";

const getTableCount = async (table) => {
  const { count, error } = await supabase.from(table).select("*", {
    count: "exact",
    head: true,
  });

  if (error) {
    throw error;
  }

  return count ?? 0;
};

const getDiscountedProductCount = async () => {
  const { count, error } = await supabase
    .from("products")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("is_discounted", true);

  if (error) {
    throw error;
  }

  return count ?? 0;
};

export const getDashboardData = async () => {
  const [
    categoryCount,
    subcategoryCount,
    brandCount,
    productCount,
    discountedProductCount,
    products,
  ] = await Promise.all([
    getTableCount("categories"),
    getTableCount("subcategories"),
    getTableCount("brands"),
    getTableCount("products"),
    getDiscountedProductCount(),
    getProducts(),
  ]);

  return {
    stats: {
      categories: categoryCount,
      subcategories: subcategoryCount,
      brands: brandCount,
      products: productCount,
      discountedProducts: discountedProductCount,
    },

    products,
  };
};
