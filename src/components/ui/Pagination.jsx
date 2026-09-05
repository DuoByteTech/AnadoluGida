import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function buildPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const keep = new Set([1, 2, current - 1, current, current + 1, total - 1, total]);

  const pages = Array.from(keep)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const res = [];
  for (let i = 0; i < pages.length; i++) {
    res.push(pages[i]);
    if (i < pages.length - 1 && pages[i + 1] - pages[i] > 1) res.push("…");
  }
  return res;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  scrollToTopOnChange = true,
}) => {
  if (totalPages <= 1) return null;

  const items = buildPageItems(currentPage, totalPages);

  const scrollTop = () => {
    if (!scrollToTopOnChange) return;

    // ✅ render sonrası garanti scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      });
    });
  };

  const changePage = (page) => {
    if (page === currentPage) return;
    onPageChange(page);
    scrollTop();
  };

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  // ✅ ortak temel (padding yok!)
  const base =
    "inline-flex items-center justify-center rounded-full select-none transition duration-200";

  // ✅ pasif buton
  const idle =
    "border border-error/40 text-base-content cursor-pointer hover:bg-error/10";

  // ✅ aktif buton
  const active = "bg-error text-white border border-error shadow-sm";

  // ✅ disabled
  const disabled = "border border-error/20 text-base-content/40 opacity-60 cursor-not-allowed";

  const size = "w-10 h-10 text-sm";

  return (
    <div className={`flex flex-col items-center gap-3 mb-10 ${className}`}>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Prev */}
        <button
          type="button"
          disabled={isPrevDisabled}
          onClick={() => changePage(Math.max(1, currentPage - 1))}
          className={[base, size, isPrevDisabled ? disabled : idle].join(" ")}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        {items.map((it, idx) =>
          it === "…" ? (
            <span key={`dots-${idx}`} className="px-2 text-base-content/60 select-none">
              …
            </span>
          ) : (
            <button
              key={it}
              type="button"
              onClick={() => changePage(it)}
              className={[base, size, currentPage === it ? active : idle].join(" ")}
              aria-current={currentPage === it ? "page" : undefined}
            >
              {it}
            </button>
          ),
        )}

        {/* Next */}
        <button
          type="button"
          disabled={isNextDisabled}
          onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
          className={[base, size, isNextDisabled ? disabled : idle].join(" ")}
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="text-xs text-base-content/60">
        Seite <span className="font-medium">{currentPage}</span> von{" "}
        <span className="font-medium">{totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;