import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const PromotionTableRow = ({ promotion }) => {

  return (
    <tr className="hover">

      <td>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 font-semibold text-base-content">
            {promotion.title.charAt(0)}
          </div>

          <div>
            <div className="font-semibold">{promotion.title}</div>
          </div>
        </div>
      </td>

      <td> {promotion.description} </td>

      <td>
        {promotion.isActive ? (
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
          <button className="btn btn-sm btn-ghost rounded-xl">
            <PencilSquareIcon className="h-4 w-4" />
            Düzenle
          </button>

          <button className="btn btn-sm btn-error btn-outline rounded-xl hover:text-white">
            <TrashIcon className="h-4 w-4" />
            Sil
          </button>
        </div>
      </td>

    </tr>
  );
};

export default PromotionTableRow;