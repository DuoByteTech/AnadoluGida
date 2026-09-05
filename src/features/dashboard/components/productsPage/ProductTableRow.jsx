import { Link } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const ProductTableRow = ({ product, formatCategoryName, onDelete }) => {
  const modalId = `delete_product_modal_${product.id}`;

  const openModal = () => {
    document.getElementById(modalId).showModal();
  };

  const closeModal = () => {
    document.getElementById(modalId).close();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product.id);
    }

    closeModal();
  };

  return (
    <>
      <tr className="hover">
        <th>{product.id}</th>

        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="h-12 w-12 rounded-xl bg-base-200 p-1">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <div>
              <div className="font-semibold">{product.name}</div>
              <div className="text-xs text-base-content/60">
                slug: {product.slug}
              </div>
            </div>
          </div>
        </td>

        <td>{formatCategoryName(product.category)}</td>
        <td>{product.subcategory}</td>
        <td>{product.brand}</td>

        <td>
          <div className="flex flex-col">
            <span className="font-semibold">€{product.price.toFixed(2)}</span>

            {product.oldPrice && (
              <span className="text-xs text-base-content/50 line-through">
                €{product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
        </td>

        <td>
          {product.isDiscounted ? (
            <span className="badge badge-error badge-sm text-white">
              İndirimli
            </span>
          ) : (
            <span className="badge badge-success badge-sm text-white">
              Aktif
            </span>
          )}
        </td>

        <td>
          <div className="flex justify-center gap-2">
            <Link
              to={`/dashboard/products/edit/${product.id}`}
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
            <b>{product.name}</b> ürününü silmek istiyor musunuz?
          </p>

          <div className="modal-action">
            <button type="button" className="btn" onClick={closeModal}>
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

export default ProductTableRow;