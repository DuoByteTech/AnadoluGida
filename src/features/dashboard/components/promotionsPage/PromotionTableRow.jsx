import { Link } from "react-router-dom";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

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
    if (!onDelete) {
      return;
    }

    const success = await onDelete(promotion.id);

    if (success) {
      closeModal();
    }
  };

  return (
    <>
      <tr className="hover">
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="h-14 w-20 overflow-hidden rounded-lg border border-base-200 bg-base-200">
                {promotion.image ? (
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-base-content/50">
                    Görsel Yok
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <div className="max-w-[260px] truncate font-semibold">
                {promotion.title}
              </div>

              {promotion.description && (
                <div className="mt-1 max-w-[260px] truncate text-xs text-base-content/60">
                  {promotion.description}
                </div>
              )}
            </div>
          </div>
        </td>

        <td>
          {promotion.discountPercentage > 0 ? (
            <span className="badge badge-error badge-outline">
              %{promotion.discountPercentage}
            </span>
          ) : (
            <span className="text-sm text-base-content/50">-</span>
          )}
        </td>

        <td>
          <span className="text-sm">{formatDate(promotion.startsAt)}</span>
        </td>

        <td>
          <span className="text-sm">{formatDate(promotion.endsAt)}</span>
        </td>

        <td>
          <span className="badge badge-ghost">{promotion.sortOrder}</span>
        </td>

        <td>
          {promotion.isActive ? (
            <span className="badge badge-success badge-outline">Aktif</span>
          ) : (
            <span className="badge badge-ghost">Pasif</span>
          )}
        </td>

        <td>
          <div className="flex items-center justify-center gap-2">
            <Link
              to={`/dashboard/promotions/${promotion.id}/edit`}
              className={[
                "btn btn-square btn-sm",
                isDeleting ? "pointer-events-none opacity-50" : "",
              ].join(" ")}
              aria-label="Promosyonu düzenle"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </Link>

            <button
              type="button"
              className="btn btn-square btn-error btn-sm text-white"
              onClick={openModal}
              disabled={isDeleting}
              aria-label="Promosyonu sil"
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <TrashIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </td>
      </tr>

      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Promosyon silinsin mi?</h3>

          <p className="py-4 text-sm text-base-content/70">
            <span className="font-semibold text-base-content">
              {promotion.title}
            </span>{" "}
            promosyonunu silmek istediğinizden emin misiniz?
          </p>

          {promotion.imageObjectKey && (
            <div className="alert alert-warning mb-4 text-sm">
              <span>
                Bu promosyonun R2 görseli varsa, promosyon kaydı silindikten
                sonra görseli ayrıca temizlememiz gerekecek.
              </span>
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={closeModal}
              disabled={isDeleting}
            >
              Vazgeç
            </button>

            <button
              type="button"
              className="btn btn-error text-white"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Siliniyor...
                </>
              ) : (
                "Sil"
              )}
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeModal} disabled={isDeleting}>
            close
          </button>
        </form>
      </dialog>
    </>
  );
};

export default PromotionTableRow;
