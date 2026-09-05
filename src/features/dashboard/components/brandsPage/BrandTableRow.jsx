import { Link } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { products } from "@/features/shop/data/products";

const BrandTableRow = ({ brand, onDelete }) => {
  const productCount = products.filter(
    (p) => p.brandSlug === brand.slug
  ).length;

  const modalId = `delete_brand_modal_${brand.id}`;

  const openModal = () => {
    document.getElementById(modalId).showModal();
  };

  const closeModal = () => {
    document.getElementById(modalId).close();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(brand.id);
    }

    closeModal();
  };

  return (
    <>
      <tr className="hover">
        <td>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 font-semibold text-base-content">
              {brand.name.charAt(0)}
            </div>

            <div>
              <div className="font-semibold">{brand.name}</div>
              <div className="text-xs text-base-content/60">
                slug: {brand.slug}
              </div>
            </div>
          </div>
        </td>

        <td>{productCount}</td>

        <td>
          {brand.isActive ? (
            <span className="badge badge-success badge-sm text-white">
              Aktif
            </span>
          ) : (
            <span className="badge badge-error badge-sm text-white">
              Pasif
            </span>
          )}
        </td>

        <td>
          <div className="flex justify-center gap-2">
            <Link
              to={`/dashboard/brands/edit/${brand.id}`}
              className="btn btn-sm btn-ghost rounded-xl"
            >
              <PencilSquareIcon className="h-4 w-4" />
              Düzenle
            </Link>

            <button
              type="button"
              onClick={openModal}
              className="btn btn-sm btn-error btn-outline rounded-xl hover:text-white"
            >
              <TrashIcon className="h-4 w-4" />
              Sil
            </button>
          </div>
        </td>
      </tr>

      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold text-error">Silme Onayı</h3>
          <p className="py-4">
            <b>{brand.name}</b> markasını silmek istiyor musunuz?
          </p>

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={closeModal}
            >
              İptal
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-error text-white"
            >
              Sil
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default BrandTableRow;