import { ChevronDownIcon } from "@heroicons/react/24/outline";

const CategoryFilter = ({
  categories = [],
  openMap = {},
  toggleOpenCat,
  mainChecked = {},
  toggleMainCategory,
  selectedCategories = [],
  toggleCategoryItem,
}) => {
  const isOpenCat = (id) => Boolean(openMap[id]);

  if (categories.length === 0) {
    return (
      <div className="px-4 py-4 text-sm text-base-content/50">
        Keine Kategorien vorhanden.
      </div>
    );
  }

  return (
    <>
      {categories.map((category) => {
        const subcategories = category.subcategories || [];

        const hasSubcategories = subcategories.length > 0;

        return (
          <div key={category.id}>
            <div className="flex items-center justify-between px-4 py-1">
              {hasSubcategories ? (
                <label className="flex cursor-pointer select-none items-center gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-error checkbox-sm"
                    checked={Boolean(mainChecked[category.id])}
                    onChange={() => toggleMainCategory(category)}
                  />

                  <span className="text-base font-semibold">
                    {category.name}
                  </span>
                </label>
              ) : (
                <div className="flex items-center gap-3 opacity-60">
                  <span className="h-5 w-5" />

                  <span className="text-base font-semibold">
                    {category.name}
                  </span>
                </div>
              )}

              {hasSubcategories && (
                <button
                  type="button"
                  onClick={() => toggleOpenCat(category.id)}
                  className="cursor-pointer rounded-full p-1 transition hover:bg-base-200 focus:outline-none"
                  aria-label={`${category.name} Unterkategorien anzeigen`}
                  aria-expanded={isOpenCat(category.id)}
                >
                  <ChevronDownIcon
                    className={[
                      "h-5 w-5 transition-transform duration-200",
                      isOpenCat(category.id) ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>
              )}
            </div>

            {hasSubcategories && isOpenCat(category.id) && (
              <div className="space-y-2 px-4 pb-2">
                {subcategories.map((subcategory) => (
                  <label
                    key={subcategory.id}
                    className="flex cursor-pointer items-center pl-10"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-error checkbox-sm mr-2"
                      checked={selectedCategories.includes(subcategory.slug)}
                      onChange={() => toggleCategoryItem(subcategory.slug)}
                    />

                    <span className="text-sm">{subcategory.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default CategoryFilter;
