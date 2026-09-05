import Search from "@/components/ui/Search";

const ShopResultsHeader = ({
  name,
  count,
  selectedBrands = [],
  brands = [],
  searchQuery,
  onSearchChange,
  onOpenFilters, // ✅ yeni
}) => {
  const brandNames = selectedBrands
    .map((slug) => brands.find((b) => b.slug === slug)?.name)
    .filter(Boolean);

  return (
    <div className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex justify-between items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold">{name}</h2>

              <span className="badge badge-neutral badge-sm">
                {count} Produkte
              </span>
            </div>

            {/* ✅ Mobile Filter Button */}
            <button
              type="button"
              onClick={onOpenFilters}
              className="border border-error/40 rounded-full px-5 py-1 hover:bg-error/10 transition duration-200 cursor-pointer lg:hidden"
            >
              Filter
            </button>
          </div>

          {brandNames.length > 0 && (
            <p className="text-sm text-base-content/60 mt-1">
              Marken: {brandNames.join(", ")}
            </p>
          )}
        </div>

        <Search value={searchQuery} onChange={onSearchChange} />
      </div>
    </div>
  );
};

export default ShopResultsHeader;