import { useMemo, useState } from "react";

/**
 * useShopFilters (SLUG)
 * selectedCategories: subcategorySlug[]
 * selectedBrands: brandSlug[]
 */
const useShopFilters = (categories, products = []) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    discounted: true,
  });

  const [openMap, setOpenMap] = useState({});

  // ✅ artık name değil slug tutuyoruz
  const [selectedCategories, setSelectedCategories] = useState([]); // subcategorySlug[]
  const [selectedBrands, setSelectedBrands] = useState([]); // brandSlug[]
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  // ✅ Search state (ShopPage'den hook'a taşındı)
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = (key) =>
    setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  const toggleOpenCat = (id) => setOpenMap((p) => ({ ...p, [id]: !p[id] }));

  // ✅ subcategory slug ile toggle
  const toggleCategoryItem = (subcategorySlug) => {
    setSelectedCategories((prev) =>
      prev.includes(subcategorySlug)
        ? prev.filter((x) => x !== subcategorySlug)
        : [...prev, subcategorySlug],
    );
  };

  // ✅ main category: alt slug’ları toplu seç / kaldır
  const toggleMainCategory = (cat) => {
    const subs = cat.subcategories || [];
    const subSlugs = subs.map((s) => s.slug);
    const allSelected = subSlugs.every((slug) =>
      selectedCategories.includes(slug),
    );

    setSelectedCategories((prev) => {
      if (allSelected) return prev.filter((x) => !subSlugs.includes(x));
      return Array.from(new Set([...prev, ...subSlugs]));
    });
  };

  // ✅ main checkbox kontrolü de slug ile
  const mainChecked = useMemo(() => {
    const map = {};
    for (const cat of categories) {
      const subs = cat.subcategories || [];
      const subSlugs = subs.map((s) => s.slug);
      map[cat.id] =
        subSlugs.length > 0 &&
        subSlugs.every((slug) => selectedCategories.includes(slug));
    }
    return map;
  }, [categories, selectedCategories]);

  // ✅ brand slug ile toggle
  const toggleBrand = (brandSlug) => {
    setSelectedBrands((prev) =>
      prev.includes(brandSlug)
        ? prev.filter((x) => x !== brandSlug)
        : [...prev, brandSlug],
    );
  };

  const toggleOnlyDiscounted = () => setOnlyDiscounted((p) => !p);

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

  // ✅ filteredProducts (ShopPage'den hook'a taşındı)
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return (products || []).filter((p) => {
      if (onlyDiscounted && !p.isDiscounted) return false;

      const passSubcat =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.subcategorySlug);

      const passBrand =
        selectedBrands.length === 0 || selectedBrands.includes(p.brandSlug);

      const passSearch =
        q.length === 0 || (p.name || "").toLowerCase().includes(q);

      return passSubcat && passBrand && passSearch;
    });
  }, [
    products,
    selectedCategories,
    selectedBrands,
    onlyDiscounted,
    searchQuery,
  ]);

  // ✅ resultsTitle (ShopPage'den hook'a taşındı)
  const resultsTitle = useMemo(() => {
    if (selectedCategories.length === 0) return "Alle Produkte";

    const subIndex = new Map();
    const parentIndex = new Map();

    for (const cat of categories) {
      for (const sub of cat.subcategories || []) {
        subIndex.set(sub.slug, sub.name);
        parentIndex.set(sub.slug, cat.name);
      }
    }

    const parentSet = new Set(
      selectedCategories.map((slug) => parentIndex.get(slug)).filter(Boolean),
    );

    if (selectedCategories.length === 1) {
      return subIndex.get(selectedCategories[0]) || "Ausgewählte Kategorie";
    }

    if (parentSet.size === 1) {
      return Array.from(parentSet)[0] || "Ausgewählte Kategorien";
    }

    return "Ausgewählte Kategorien";
  }, [categories, selectedCategories]);

  return {
    // UI state
    openSections,
    openMap,

    // Filter state
    selectedCategories,
    selectedBrands,
    onlyDiscounted,
    searchQuery,

    // Derived
    mainChecked,
    hasAnyFilter,
    filteredProducts,
    resultsTitle,

    // Handlers
    toggleSection,
    toggleOpenCat,
    toggleCategoryItem,
    toggleMainCategory,
    toggleBrand,
    toggleOnlyDiscounted,
    setSearchQuery,
    clearAll,

    // ✅ URL’den set etmek için dışarı açıyoruz
    setSelectedCategories,
    setOpenMap,
    setSelectedBrands, // (şimdilik şart değil ama ileride URL brand eklersen lazım olur)
    setOnlyDiscounted,
  };
};

export default useShopFilters;
