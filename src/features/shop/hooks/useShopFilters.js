import { useMemo, useState } from "react";

const useShopFilters = (categories = [], products = []) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    discounted: true,
  });

  const [openMap, setOpenMap] = useState({});

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [selectedBrands, setSelectedBrands] = useState([]);

  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleOpenCat = (id) => {
    setOpenMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleCategoryItem = (subcategorySlug) => {
    if (!subcategorySlug) {
      return;
    }

    setSelectedCategories((prev) => {
      if (prev.includes(subcategorySlug)) {
        return prev.filter((item) => item !== subcategorySlug);
      }

      return [...prev, subcategorySlug];
    });
  };

  const toggleMainCategory = (category) => {
    const subcategories = category?.subcategories || [];

    const subcategorySlugs = subcategories
      .map((subcategory) => subcategory.slug)
      .filter(Boolean);

    if (subcategorySlugs.length === 0) {
      return;
    }

    const allSelected = subcategorySlugs.every((slug) =>
      selectedCategories.includes(slug),
    );

    setSelectedCategories((prev) => {
      if (allSelected) {
        return prev.filter((slug) => !subcategorySlugs.includes(slug));
      }

      return Array.from(new Set([...prev, ...subcategorySlugs]));
    });
  };

  const mainChecked = useMemo(() => {
    const result = {};

    for (const category of categories) {
      const subcategorySlugs = (category.subcategories || [])
        .map((subcategory) => subcategory.slug)
        .filter(Boolean);

      result[category.id] =
        subcategorySlugs.length > 0 &&
        subcategorySlugs.every((slug) => selectedCategories.includes(slug));
    }

    return result;
  }, [categories, selectedCategories]);

  const toggleBrand = (brandSlug) => {
    if (!brandSlug) {
      return;
    }

    setSelectedBrands((prev) => {
      if (prev.includes(brandSlug)) {
        return prev.filter((item) => item !== brandSlug);
      }

      return [...prev, brandSlug];
    });
  };

  const toggleOnlyDiscounted = () => {
    setOnlyDiscounted((prev) => !prev);
  };

  const hasAnyFilter =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    onlyDiscounted ||
    searchQuery.trim().length > 0;

  const clearAll = () => {
    setSelectedCategories([]);

    setSelectedBrands([]);

    setOnlyDiscounted(false);

    setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("de");

    return (products || []).filter((product) => {
      if (onlyDiscounted && !product.isDiscounted) {
        return false;
      }

      const subcategorySlug = product.subcategorySlug || "";

      const brandSlug = product.brandSlug || "";

      const productName = product.name || "";

      const passesCategory =
        selectedCategories.length === 0 ||
        (subcategorySlug && selectedCategories.includes(subcategorySlug));

      const passesBrand =
        selectedBrands.length === 0 ||
        (brandSlug && selectedBrands.includes(brandSlug));

      const passesSearch =
        query.length === 0 ||
        productName.toLocaleLowerCase("de").includes(query);

      return passesCategory && passesBrand && passesSearch;
    });
  }, [
    products,
    selectedCategories,
    selectedBrands,
    onlyDiscounted,
    searchQuery,
  ]);

  const resultsTitle = useMemo(() => {
    if (selectedCategories.length === 0) {
      return onlyDiscounted ? "Angebote" : "Alle Produkte";
    }

    const subcategoryIndex = new Map();

    const parentIndex = new Map();

    for (const category of categories) {
      for (const subcategory of category.subcategories || []) {
        subcategoryIndex.set(subcategory.slug, subcategory.name);

        parentIndex.set(subcategory.slug, category.name);
      }
    }

    const parentNames = new Set(
      selectedCategories.map((slug) => parentIndex.get(slug)).filter(Boolean),
    );

    if (selectedCategories.length === 1) {
      return (
        subcategoryIndex.get(selectedCategories[0]) || "Ausgewählte Kategorie"
      );
    }

    if (parentNames.size === 1) {
      return Array.from(parentNames)[0] || "Ausgewählte Kategorien";
    }

    return "Ausgewählte Kategorien";
  }, [categories, selectedCategories, onlyDiscounted]);

  return {
    openSections,
    openMap,

    selectedCategories,
    selectedBrands,
    onlyDiscounted,
    searchQuery,

    mainChecked,
    hasAnyFilter,
    filteredProducts,
    resultsTitle,

    toggleSection,
    toggleOpenCat,
    toggleCategoryItem,
    toggleMainCategory,
    toggleBrand,
    toggleOnlyDiscounted,
    setSearchQuery,
    clearAll,

    setSelectedCategories,
    setOpenMap,
    setSelectedBrands,
    setOnlyDiscounted,
  };
};

export default useShopFilters;
