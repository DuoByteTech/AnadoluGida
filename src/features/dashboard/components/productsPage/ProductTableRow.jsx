import { Link } from "react-router-dom";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const ProductTableRow = ({
  product,
  formatCategoryName,
  onDelete,
  isDeleting = false,
}) => {
  const modalId = `delete_product_modal_${product.id}`;

  const openModal = () => {
    if (isDeleting) return;

    document.getElementById(modalId)?.showModal();
  };

  const closeModal = () => {
    if (isDeleting) return;

    document.getElementById(modalId)?.close();
  };

  const handleDelete = async () => {
    if (isDeleting || !onDelete) return;

    try {
      await onDelete(product.id);

      document.getElementById(modalId)?.close();
    } catch (err) {
      console.error("Ürün satırından silme işlemi başarısız:", err);
    }
  };

  const discountPercentage = Number(product.discountPercentage) || 0;
  const hasDiscount = discountPercentage > 0;

  const basePrice = Number(product.price) || 0;

  const finalPrice = hasDiscount
    ? Number((basePrice * (1 - discountPercentage / 100)).toFixed(2))
    : basePrice;

  return (
    <>
      <tr className={isDeleting ? "opacity-60" : "hover"}>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="h-12 w-12 rounded-xl bg-base-200 p-1">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center text-xs text-base-content/40">
                    Görsel yok
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="font-semibold">{product.name}</div>

              <div className="text-xs text-base-content/60">{product.slug}</div>
            </div>
          </div>
        </td>

        <td>{formatCategoryName(product.category)}</td>

        <td>{product.subcategory || "-"}</td>

        <td>{product.brand || "-"}</td>

        <td>
          {hasDiscount ? (
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-brand-red-700">
                €{finalPrice.toFixed(2)}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-base-content/50 line-through">
                  €{basePrice.toFixed(2)}
                </span>

                <span className="badge badge-error badge-xs text-white">
                  -{discountPercentage}%
                </span>
              </div>
            </div>
          ) : (
            <span className="font-semibold">€{basePrice.toFixed(2)}</span>
          )}
        </td>

        <td>
          {product.isActive ? (
            <span className="badge badge-success badge-sm text-white">
              Aktif
            </span>
          ) : (
            <span className="badge badge-error badge-sm text-white">Pasif</span>
          )}
        </td>

        <td>
          <div className="flex justify-center gap-2">
            <Link
              to={`/dashboard/products/edit/${product.id}`}
              className={`btn btn-sm btn-ghost rounded-xl ${
                isDeleting ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <PencilSquareIcon className="h-4 w-4" />
              Düzenle
            </Link>

            <button
              type="button"
              onClick={openModal}
              disabled={isDeleting}
              className="btn btn-sm rounded-xl border-brand-red-700 bg-transparent text-brand-red-700 hover:border-brand-red-800 hover:bg-brand-red-800 hover:text-white"
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <TrashIcon className="h-4 w-4" />
              )}

              {isDeleting ? "Siliniyor..." : "Sil"}
            </button>
          </div>
        </td>
      </tr>

      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold text-brand-red-700">Silme Onayı</h3>

          <p className="py-4">
            <b>{product.name}</b> ürününü silmek istiyor musunuz?
          </p>

          {product.images?.length > 0 && (
            <div className="mb-4 rounded-xl bg-warning/10 p-3 text-sm">
              Bu ürüne ait <strong>{product.images.length}</strong> görsel de
              kalıcı olarak silinecek.
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={closeModal}
              disabled={isDeleting}
            >
              İptal
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn rounded-xl border-brand-red-700 bg-brand-red-700 text-white hover:border-brand-red-800 hover:bg-brand-red-800"
            >
              {isDeleting && (
                <span className="loading loading-spinner loading-sm" />
              )}

              {isDeleting ? "Siliniyor..." : "Sil"}
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button disabled={isDeleting}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ProductTableRow;
