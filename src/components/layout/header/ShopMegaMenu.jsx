import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { categories } from "../constants/categories";

const ShopMegaMenu = ({ open, onClose }) => {
  const panelRef = useRef(null);
  const [activeSlug, setActiveSlug] = useState(categories?.[0]?.slug);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === activeSlug) || categories[0],
    [activeSlug],
  );

  useEffect(() => {
    if (!open) return;

    const onDown = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) onClose?.();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="
        absolute left-0 top-full w-full
        bg-base-100 border-t border-base-200
        shadow-lg z-50
      "
    >
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <NavLink
            to="/shop"
            onClick={onClose}
            className="
              inline-flex items-center gap-2
              text-xs sm:text-sm font-semibold tracking-wide
              text-base-content/70 hover:text-base-content
              transition
            "
          >
            <span className="uppercase tracking-widest">Kategorien</span>
            <span className="opacity-60">→</span>
          </NavLink>

          <NavLink
            to="/shop"
            onClick={onClose}
            className="hidden sm:flex items-center gap-2 border border-error/40 rounded-full px-4 py-1 hover:bg-error/10 transition duration-200"
          >
            Alle anzeigen
          </NavLink>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Left */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="rounded-2xl border border-base-content/20 bg-base-100 p-2">
              <ul className="menu w-full">
                {categories.map((cat) => {
                  const active = cat.slug === activeSlug;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveSlug(cat.slug)}
                        onFocus={() => setActiveSlug(cat.slug)}
                        onClick={() => setActiveSlug(cat.slug)}
                        className={`flex w-full items-center justify-between ${active
                          ? "text-error bg-error/10"
                          : "text-base-content/80"
                          }`}
                      >
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-xs opacity-60">
                          {cat.subcategories?.length || 0}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Right */}
          <section className="col-span-12 lg:col-span-9">
            <div className="rounded-2xl border border-base-content/20 bg-base-100 p-4 sm:p-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-widest opacity-60">
                    Kategorie
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    {activeCategory?.name}
                  </h3>
                </div>

                <NavLink
                  to={`/shop/${activeCategory?.slug}`}
                  onClick={onClose}
                  className="hidden sm:flex items-center gap-2 border border-error/40 rounded-full px-4 py-1 hover:bg-error/10 transition duration-200"
                >
                  Alle anzeigen
                </NavLink>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {(activeCategory?.subcategories || []).map((sub) => (
                  <NavLink
                    key={sub.id}
                    to={`/shop/${activeCategory.slug}/${sub.slug}`}
                    onClick={onClose}
                    className="
                      rounded-xl border border-base-400 px-3 py-3
                      hover:bg-error/10 hover:border-error/40 transition duration-200 hover:shadow-sm
                      text-sm font-medium text-base-content/80 hover:text-base-content
                    "
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-base-200/40 p-4">
                <div className="text-sm font-semibold">Alt bölümler</div>
                <div className="text-sm opacity-70">
                  Buraya “Top Angebote”, “Beliebt”, “Marken” gibi bloklar
                  ekleyebiliriz.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShopMegaMenu;