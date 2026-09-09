import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { getShopCategories } from "@/features/shop/services/filter.service";

const ShopMegaMenu = ({ open, onClose }) => {
  const panelRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [activeSlug, setActiveSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoading(true);

        const data = await getShopCategories();

        if (!isMounted) {
          return;
        }

        setCategories(data);

        if (data.length > 0) {
          setActiveSlug((current) => current || data[0].slug);
        }
      } catch (error) {
        console.error("Header kategorileri yüklenemedi:", error);

        if (isMounted) {
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategory = useMemo(() => {
    return (
      categories.find((category) => category.slug === activeSlug) ||
      categories[0] ||
      null
    );
  }, [categories, activeSlug]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onDown = (event) => {
      if (!panelRef.current) {
        return;
      }

      if (!panelRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-full z-50 w-full border-t border-base-200 bg-base-100 shadow-lg"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <NavLink
            to="/shop"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-base-content/70 transition hover:text-base-content sm:text-sm"
          >
            <span className="uppercase tracking-widest">Kategorien</span>
            <span className="opacity-60">→</span>
          </NavLink>

          <NavLink
            to="/shop"
            onClick={onClose}
            className="hidden items-center gap-2 rounded-full border border-error/40 px-4 py-1 transition hover:bg-error/10 sm:flex"
          >
            Alle anzeigen
          </NavLink>
        </div>

        {isLoading ? (
          <div className="flex min-h-40 items-center justify-center">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-10 text-center text-sm text-base-content/60">
            Keine Kategorien verfügbar.
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-5">
            <aside className="col-span-12 lg:col-span-3">
              <div className="rounded-2xl border border-base-content/20 bg-base-100 p-2">
                <ul className="menu w-full">
                  {categories.map((category) => {
                    const active = category.slug === activeSlug;

                    return (
                      <li key={category.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveSlug(category.slug)}
                          onFocus={() => setActiveSlug(category.slug)}
                          onClick={() => setActiveSlug(category.slug)}
                          className={`flex w-full items-center justify-between ${
                            active
                              ? "bg-error/10 text-error"
                              : "text-base-content/80"
                          }`}
                        >
                          <span className="font-medium">{category.name}</span>

                          <span className="text-xs opacity-60">
                            {category.subcategories?.length || 0}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {activeCategory && (
              <section className="col-span-12 lg:col-span-9">
                <div className="rounded-2xl border border-base-content/20 bg-base-100 p-4 sm:p-6">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-widest opacity-60">
                        Kategorie
                      </div>

                      <h3 className="text-xl font-bold sm:text-2xl">
                        {activeCategory.name}
                      </h3>
                    </div>

                    <NavLink
                      to={`/shop/${activeCategory.slug}`}
                      onClick={onClose}
                      className="hidden items-center gap-2 rounded-full border border-error/40 px-4 py-1 transition hover:bg-error/10 sm:flex"
                    >
                      Alle anzeigen
                    </NavLink>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {(activeCategory.subcategories || []).map((subcategory) => (
                      <NavLink
                        key={subcategory.id}
                        to={`/shop/${activeCategory.slug}/${subcategory.slug}`}
                        onClick={onClose}
                        className="rounded-xl border border-base-200 px-4 py-3 text-sm transition hover:border-error/30 hover:bg-error/5 hover:text-error"
                      >
                        {subcategory.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopMegaMenu;
