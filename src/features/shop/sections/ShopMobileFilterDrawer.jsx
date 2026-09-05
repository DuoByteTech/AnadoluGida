import { useEffect, useRef } from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";

const ShopMobileFilterDrawer = ({ open, onClose, children }) => {
  const panelRef = useRef(null);

  // ESC + outside click
  useEffect(() => {
    if (!open) return;

    const onDown = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) onClose?.();
    };

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
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
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* panel */}
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-[92%] max-w-sm bg-base-100 shadow-2xl flex flex-col"
      >
        <div className="px-4 py-4 border-b border-base-200 flex items-center justify-between">
          <div className="text-sm font-semibold">Filter</div>
          <button
            type="button"
            className="border border-error/40 rounded-full px-2 py-2 hover:bg-error/10 transition duration-200 cursor-pointer"
            onClick={onClose}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">{children}</div>

        <div className="mt-auto p-4 border-t border-base-200">
          <button
            type="button"
            className="btn btn-error w-full rounded-2xl"
            onClick={onClose}
          >
            Anwenden
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopMobileFilterDrawer;