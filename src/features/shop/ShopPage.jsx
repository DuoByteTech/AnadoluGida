import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

import ShopSidebar from "./sections/ShopSidebar";
import ShopContent from "./sections/ShopContent";
import ShopResultsHeader from "./sections/ShopResultsHeader";
import ShopMobileFilterDrawer from "./sections/ShopMobileFilterDrawer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

import { products } from "./data/products";
import { categories, brands } from "./data/filters";
import useShopFilters from "./hooks/useShopFilters";

const ShopPage = () => {
  const { categorySlug, subSlug } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const filters = useShopFilters(categories, products);
  const {
    selectedBrands,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    resultsName,

    setSelectedCategories,
    setOpenMap,
    setOnlyDiscounted,
  } = filters;

  const [filterOpen, setFilterOpen] = useState(false);

  // 0) /shop?discount=true -> discounted on (ama /angebote hariç)
  useEffect(() => {
    if (location.pathname === "/angebote") return;

    const discountParam = searchParams.get("discount");
    const shouldDiscount = discountParam === "true" || discountParam === "1";

    setOnlyDiscounted(shouldDiscount);
  }, [location.pathname, searchParams, setOnlyDiscounted]);

  // 1) /angebote -> discounted on (kategori temiz)
  useEffect(() => {
    const isAngebote = location.pathname === "/angebote";

    if (isAngebote) {
      setOnlyDiscounted(true);
      setSelectedCategories([]);
      return;
    }

    // ❗ burada artık setOnlyDiscounted(false) yok
    // çünkü /shop?discount=true olabilir (0. effect bunu yönetiyor)
  }, [location.pathname, setOnlyDiscounted, setSelectedCategories]);

  // 2) /shop/:categorySlug/:subSlug -> sync sidebar selection
  useEffect(() => {
    if (location.pathname === "/angebote") return;

    if (!categorySlug && !subSlug) {
      setSelectedCategories([]);
      return;
    }

    const cat = categories.find((c) => c.slug === categorySlug);

    if (!cat) {
      setSelectedCategories([]);
      return;
    }

    setOpenMap((prev) => ({ ...prev, [cat.id]: true }));

    if (subSlug) {
      setSelectedCategories([subSlug]);
      return;
    }

    const subs = (cat.subcategories || []).map((s) => s.slug);
    setSelectedCategories(subs);
  }, [location.pathname, categorySlug, subSlug, setSelectedCategories, setOpenMap]);

  return (
    <>
      <Breadcrumbs />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Desktop sidebar only */}
        <aside className="hidden lg:block lg:col-span-3">
          <ShopSidebar categories={categories} brands={brands} filters={filters} />
        </aside>

        <section className="lg:col-span-9">
          <div className="mb-5">
            <ShopResultsHeader
              name={resultsName}
              count={filteredProducts.length}
              selectedBrands={selectedBrands}
              brands={brands}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenFilters={() => setFilterOpen(true)}
            />
          </div>

          <ShopContent
            key={filteredProducts.length}
            filteredProducts={filteredProducts}
          />
        </section>
      </div>

      {/* Mobile drawer as separate section */}
      <ShopMobileFilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)}>
        <ShopSidebar categories={categories} brands={brands} filters={filters} />
      </ShopMobileFilterDrawer>
    </>
  );
};

export default ShopPage;