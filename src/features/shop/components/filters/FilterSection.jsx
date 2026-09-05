import { ChevronDownIcon } from "@heroicons/react/24/outline";

const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
  maxHeight = 260, // ✅ her bölüm için default yükseklik
}) => {
  return (
    <div>
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="font-semibold">{title}</span>

        <button
          type="button"
          onClick={onToggle}
          className="p-1 rounded-full focus:outline-none cursor-pointer"
          aria-label={`Toggle ${title}`}
        >
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>
      </div>

      {isOpen && (
        <div
          className="pb-3 overflow-y-auto pr-2"
          style={{ maxHeight }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;