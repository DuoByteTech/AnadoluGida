import { Link } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const CategoryTableRow = ({ category, onDelete }) => {

  const openModal = () => {
    document.getElementById(`delete_modal_${category.id}`).showModal();
  };

  const handleDelete = () => {
    onDelete(category.id);
  };

  return (
    <>
      <tr className="hover">
        <td>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 font-semibold">
              {category.name.charAt(0)}
            </div>

            <div>
              <div className="font-semibold">{category.name}</div>
              <div className="text-xs opacity-60">
                slug: {category.slug}
              </div>
            </div>
          </div>
        </td>

        <td>{category.productCount}</td>

        <td>
          {category.isActive ? (
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
              to={`/dashboard/categories/edit/${category.id}`}
              className="btn btn-sm btn-ghost rounded-xl"
            >
              <PencilSquareIcon className="h-4 w-4" />
              Düzenle
            </Link>

            <button
              onClick={openModal}
              className="btn btn-sm btn-error btn-outline rounded-xl hover:text-white"
            >
              <TrashIcon className="h-4 w-4" />
              Sil
            </button>
          </div>
        </td>
      </tr>

      {/* MODAL */}
      <dialog id={`delete_modal_${category.id}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Emin misiniz?</h3>
          <p className="py-4">
            <b>{category.name}</b> kategorisini silmek istediğinize emin misiniz?
          </p>

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn">İptal</button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-error text-white"
              >
                Sil
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CategoryTableRow;