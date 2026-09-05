import { Link } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const SubCategoryTableRow = ({ subcategory, onDelete }) => {
  const modalId = `delete_modal_${subcategory.id}`;

  const openModal = () => {
    document.getElementById(modalId).showModal();
  };

  const closeModal = () => {
    document.getElementById(modalId).close();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(subcategory.id);
    }

    closeModal();
  };

  return (
    <>
      <tr className="hover">
        <td>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 font-semibold text-base-content">
              {subcategory.name.charAt(0)}
            </div>

            <div>
              <div className="font-semibold">{subcategory.name}</div>
              <div className="text-xs text-base-content/60">
                slug: {subcategory.slug}
              </div>
            </div>
          </div>
        </td>

        <td>{subcategory.category}</td>
        <td>{subcategory.productCount}</td>

        <td>
          {subcategory.isActive ? (
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
              to={`/dashboard/subcategories/edit/${subcategory.id}`}
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
          <h3 className="font-bold text-lg text-error">Silme Onayı</h3>
          <p className="py-4">
            <b>{subcategory.name}</b> alt kategorisini silmek istiyor musunuz?
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

export default SubCategoryTableRow;