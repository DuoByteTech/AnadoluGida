import { Link } from "react-router-dom";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const PromotionTableRow = ({ promotion, onDelete, isDeleting = false }) => {
  const modalId = `delete_promotion_modal_${promotion.id}`;

  const openModal = () => {
    if (isDeleting) {
      return;
    }

    document.getElementById(modalId)?.showModal();
  };

  const closeModal = () => {
    if (isDeleting) {
      return;
    }

    document.getElementById(modalId)?.close();
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) {
      return;
    }

    const success = await onDelete(promotion.id);

    if (success) {
      document.getElementById(modalId)?.close();
    }
  };

  return (
    <>
      <tr className={isDeleting ? "opacity-60" : "hover"}>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="h-12 w-16 overflow-hidden rounded-xl bg-base-200">
                {promotion.image ? (
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-base-content/40">
                    Görsel yok
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="font-semibold">{promotion.title}</div>
            </div>
          </div>
        </td>

        <td>
          <div className="max-w-md truncate text-sm text-base-content/70">
            {promotion.description || "-"}
          </div>
        </td>

        <td>
          <div className="flex justify-center gap-2">
            <Link
              to={`/dashboard/promotions/edit/${promotion.id}`}
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
              className="btn btn-sm btn-error btn-outline rounded-xl hover:text-white"
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
          <h3 className="text-lg font-bold">Emin misiniz?</h3>

          <p className="py-4">
            <b>{promotion.title}</b> promosyonunu silmek istediğinize emin
            misiniz?
          </p>

          <div className="modal-action">
            <div className="flex gap-2">
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
                className="btn btn-error text-white"
              >
                {isDeleting && (
                  <span className="loading loading-spinner loading-sm" />
                )}

                {isDeleting ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default PromotionTableRow;
