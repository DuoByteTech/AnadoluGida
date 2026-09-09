import { CardTitle } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";

import FilterSection from "../components/filters/FilterSection";
import CategoryFilter from "../components/filters/CategoryFilter";
import BrandFilter from "../components/filters/BrandFilter";
import DiscountFilter from "../components/filters/DiscountFilter";

const ShopSidebar = ({ categories, brands, filters }) => {
  const {
    openSections,
    openMap,
    selectedCategories,
    selectedBrands,
    onlyDiscounted,
    mainChecked,
    hasAnyFilter,
    toggleSection,
    toggleOpenCat,
    toggleCategoryItem,
    toggleMainCategory,
    toggleBrand,
    toggleOnlyDiscounted,
    clearAll,
  } = filters;

  return (
    <aside className="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-200 mb-16">
      <CardTitle className="mb-3">Filter</CardTitle>

      <FilterSection
        title="Kategorien"
        isOpen={openSections.categories}
        onToggle={() => toggleSection("categories")}
        maxHeight={300}
      >
        <CategoryFilter
          categories={categories}
          openMap={openMap}
          toggleOpenCat={toggleOpenCat}
          mainChecked={mainChecked}
          toggleMainCategory={toggleMainCategory}
          selectedCategories={selectedCategories}
          toggleCategoryItem={toggleCategoryItem}
        />
      </FilterSection>

      <Divider className="!border-black/15" />

      <FilterSection
        title="Marken"
        isOpen={openSections.brands}
        onToggle={() => toggleSection("brands")}
        maxHeight={260}
      >
        <BrandFilter
          brands={brands}
          selectedBrands={selectedBrands}
          toggleBrand={toggleBrand}
        />
      </FilterSection>

      <Divider className="!border-black/15" />

      <FilterSection
        title="Rabatt"
        isOpen={openSections.discounted}
        onToggle={() => toggleSection("discounted")}
      >
        <DiscountFilter
          onlyDiscounted={onlyDiscounted}
          toggleOnlyDiscounted={toggleOnlyDiscounted}
        />
      </FilterSection>

      {hasAnyFilter && (
        <>
          <Divider className="!border-black/15" />

          <Button
            onClick={clearAll}
            className="px-6 py-2.5 w-full rounded-full bg-error text-white font-semibold hover:bg-error/90 shadow-sm hover:shadow-md transition mt-5"
          >
            Filter zurücksetzen
          </Button>
        </>
      )}
    </aside>
  );
};

export default ShopSidebar;
