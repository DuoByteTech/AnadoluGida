import { ChevronDownIcon } from "@heroicons/react/24/outline";

const CategoryFilter = ({
  categories,
  openMap,
  toggleOpenCat,
  mainChecked,
  toggleMainCategory,
  selectedCategories,
  toggleCategoryItem,
}) => {
  const isOpenCat = (id) => !!openMap[id];

  return (
    <>
      {categories.map((cat) => {
        const subs = cat.subcategories || [];
        const hasSubs = subs.length > 0;

        return (
          <div key={cat.id}>
            <div className="px-4 py-1 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-error"
                  checked={!!mainChecked[cat.id]}
                  onChange={() => toggleMainCategory(cat)}
                />
                <span className="font-semibold text-base">{cat.name}</span>
              </label>

              {hasSubs && (
                <button
                  type="button"
                  onClick={() => toggleOpenCat(cat.id)}
                  className="p-1 rounded-full focus:outline-none cursor-pointer"
                  aria-label="Toggle subcategories"
                >
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform duration-200 ${isOpenCat(cat.id) ? "rotate-180" : ""
                      }`}
                  />
                </button>
              )}
            </div>

            {hasSubs && isOpenCat(cat.id) && (
              <div className="px-4 space-y-2">
                {subs.map((sub) => (
                  <label
                    key={sub.id}
                    className="flex items-center pl-10 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-error mr-2"
                      checked={selectedCategories.includes(sub.slug)}
                      onChange={() => toggleCategoryItem(sub.slug)}
                    />
                    <span className="text-sm">{sub.name}</span>
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