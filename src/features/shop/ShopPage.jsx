import { useEffect, useState } from "react";

import { useLocation, useParams, useSearchParams } from "react-router-dom";

import Breadcrumbs from "@/components/ui/Breadcrumbs";

import ShopSidebar from "./sections/ShopSidebar";
import ShopContent from "./sections/ShopContent";
import ShopResultsHeader from "./sections/ShopResultsHeader";
import ShopMobileFilterDrawer from "./sections/ShopMobileFilterDrawer";

import useShopFilters from "./hooks/useShopFilters";

import { getShopProducts } from "./services/product.service";

import { getShopFilters } from "./services/filter.service";

const ShopPage = () => {
  const { categorySlug, subSlug } = useParams();

  const location = useLocation();

  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [brands, setBrands] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);

  const filters = useShopFilters(categories, products);

  const {
    selectedBrands,

    searchQuery,
    setSearchQuery,

    filteredProducts,

    resultsTitle,

    setSelectedCategories,
    setOpenMap,
    setOnlyDiscounted,
  } = filters;

  const loadShopData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [productData, filterData] = await Promise.all([
        getShopProducts(),
        getShopFilters(),
      ]);

      setProducts(productData);

      setCategories(filterData.categories);

      setBrands(filterData.brands);
    } catch (err) {
      console.error("Shop verileri yüklenirken hata oluştu:", err);

      setError("Produkte und Filter konnten nicht geladen werden.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShopData();
  }, []);

  /*
   * /shop?discount=true
   */
  useEffect(() => {
    if (location.pathname === "/angebote") {
      return;
    }

    const discountParam = searchParams.get("discount");

    const shouldDiscount = discountParam === "true" || discountParam === "1";

    setOnlyDiscounted(shouldDiscount);
  }, [location.pathname, searchParams, setOnlyDiscounted]);

  /*
   * /angebote
   */
  useEffect(() => {
    const isAngebote = location.pathname === "/angebote";

    if (!isAngebote) {
      return;
    }

    setOnlyDiscounted(true);

    setSelectedCategories([]);
  }, [location.pathname, setOnlyDiscounted, setSelectedCategories]);

  /*
   * /shop/:categorySlug
   * /shop/:categorySlug/:subSlug
   */
  useEffect(() => {
    if (location.pathname === "/angebote") {
      return;
    }

    if (!categorySlug && !subSlug) {
      setSelectedCategories([]);

      return;
    }

    const category = categories.find((item) => item.slug === categorySlug);

    if (!category) {
      setSelectedCategories([]);

      return;
    }

    setOpenMap((prev) => ({
      ...prev,

      [category.id]: true,
    }));

    if (subSlug) {
      const subcategoryExists = (category.subcategories || []).some(
        (subcategory) => subcategory.slug === subSlug,
      );

      if (subcategoryExists) {
        setSelectedCategories([subSlug]);
      } else {
        setSelectedCategories([]);
      }

      return;
    }

    const subcategorySlugs = (category.subcategories || []).map(
      (subcategory) => subcategory.slug,
    );

    setSelectedCategories(subcategorySlugs);
  }, [
    location.pathname,
    categorySlug,
    subSlug,
    categories,
    setSelectedCategories,
    setOpenMap,
  ]);

  if (isLoading) {
    return (
      <>
        <Breadcrumbs />

        <div className="flex min-h-[450px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg" />

            <span className="text-sm text-base-content/60">
              Produkte werden geladen...
            </span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Breadcrumbs />

        <div className="py-10">
          <div className="alert alert-error">
            <span>{error}</span>

            <button type="button" className="btn btn-sm" onClick={loadShopData}>
              Erneut versuchen
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <ShopSidebar
            categories={categories}
            brands={brands}
            filters={filters}
          />
        </aside>

        <section className="lg:col-span-9">
          <div className="mb-5">
            <ShopResultsHeader
              name={resultsTitle}
              count={filteredProducts.length}
              selectedBrands={selectedBrands}
              brands={brands}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenFilters={() => setFilterOpen(true)}
            />
          </div>

          {filteredProducts.length > 0 ? (
            <ShopContent filteredProducts={filteredProducts} />
          ) : (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-base-300">
              <div className="space-y-2 px-6 text-center">
                <div className="text-lg font-semibold">
                  Keine Produkte gefunden
                </div>

                <p className="text-sm text-base-content/60">
                  Für die ausgewählten Filter wurden keine Produkte gefunden.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <ShopMobileFilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      >
        <ShopSidebar
          categories={categories}
          brands={brands}
          filters={filters}
        />
      </ShopMobileFilterDrawer>
    </>
  );
};

export default ShopPage;
