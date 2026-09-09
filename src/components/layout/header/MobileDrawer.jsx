import { useEffect, useRef, useState } from "react";

import { NavLink } from "react-router-dom";

import {
  XMarkIcon,
  ChevronDownIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

import Search from "@/components/ui/Search";

import navItems from "../constants/navItems";

import { getShopCategories } from "@/features/shop/services/filter.service";

import logo from "@/assets/anadolugida.png";

const MobileDrawer = ({ open, onClose }) => {
  const drawerRef = useRef(null);

  const [openCats, setOpenCats] = useState({});
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);

        const data = await getShopCategories();

        if (!isMounted) {
          return;
        }

        setCategories(data || []);
      } catch (error) {
        console.error("Mobil menü kategorileri yüklenemedi:", error);

        if (isMounted) {
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // ESC + dışarı tıkla
  useEffect(() => {
    if (!open) {
      return;
    }

    const onDown = (e) => {
      if (!drawerRef.current) {
        return;
      }

      if (!drawerRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // scroll lock
  useEffect(() => {
    if (!open) {
      return;
    }

    const prev = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const toggleCat = (id) => {
    setOpenCats((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* panel */}
      <div
        ref={drawerRef}
        className="
          absolute right-0 top-0
          flex h-full w-[92%] max-w-sm flex-col
          bg-base-100 shadow-2xl
        "
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-base-200 px-4 py-4">
          <NavLink to="/" className="ml-1" onClick={onClose}>
            <img src={logo} alt="Anadolu Gıda" className="h-7 w-auto" />
          </NavLink>

          <button
            type="button"
            className="cursor-pointer rounded-full border border-error/40 px-2 py-2 transition duration-200 hover:bg-error/10"
            onClick={onClose}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* content */}
        <div className="overflow-y-auto px-4 py-4">
          <div className="mb-4">
            <Search />
          </div>

          {/* phone */}
          <a
            href="tel:+491732461008"
            className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-error/30 px-4 py-3 transition hover:bg-error/10"
            onClick={onClose}
          >
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-error" />

              <div className="text-sm font-semibold">+49 173 2461008</div>
            </div>

            <span className="text-xs opacity-60">Anrufen</span>
          </a>

          {/* main nav */}
          <div className="space-y-1">
            {navItems
              .filter((item) => item.url !== "/shop")
              .map((item) => (
                <NavLink
                  key={item.id}
                  to={item.url}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center justify-between
                    rounded-xl px-4 py-3
                    text-sm font-semibold
                    ${
                      isActive
                        ? "bg-error/10 text-error"
                        : "text-base-content/80 hover:bg-base-200/60"
                    }
                    transition
                  `}
                >
                  {item.name}
                </NavLink>
              ))}
          </div>

          {/* shop accordion */}
          <div className="mt-6">
            <div className="mb-2 text-xs uppercase tracking-widest opacity-60">
              Shop Kategorien
            </div>

            <div className="overflow-hidden rounded-2xl border border-base-200">
              {isLoadingCategories ? (
                <div className="flex min-h-32 items-center justify-center">
                  <span className="loading loading-spinner loading-md" />
                </div>
              ) : categories.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-base-content/60">
                  Keine Kategorien verfügbar.
                </div>
              ) : (
                categories.map((cat) => {
                  const isOpen = !!openCats[cat.id];
                  const subs = cat.subcategories || [];

                  return (
                    <div
                      key={cat.id}
                      className="border-b border-base-200 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => toggleCat(cat.id)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {cat.name}
                          </span>

                          <span className="text-xs opacity-60">
                            ({subs.length})
                          </span>
                        </div>

                        <ChevronDownIcon
                          className={`h-5 w-5 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-3">
                          {subs.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {subs.map((sub) => (
                                <NavLink
                                  key={sub.id}
                                  to={`/shop/${cat.slug}/${sub.slug}`}
                                  onClick={onClose}
                                  className="
                                    rounded-xl border border-base-200
                                    px-3 py-2
                                    text-xs font-semibold
                                    text-base-content/80
                                    transition
                                    hover:border-base-300
                                    hover:bg-base-200/60
                                  "
                                >
                                  {sub.name}
                                </NavLink>
                              ))}
                            </div>
                          )}

                          <NavLink
                            to={`/shop/${cat.slug}`}
                            onClick={onClose}
                            className="btn btn-sm btn-outline mt-3 w-full"
                          >
                            {cat.name} → Alle anzeigen
                          </NavLink>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="mt-auto border-t border-base-200 px-4 py-4">
          <NavLink
            to="/shop"
            onClick={onClose}
            className="btn btn-error w-full rounded-2xl"
          >
            Zum Shop
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
