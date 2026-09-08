import Card from "@/components/ui/Card";
import Search from "@/components/ui/Search";
import Pagination from "@/components/ui/Pagination";
import { CardTitle } from "@/components/ui/Typography";

import usePagination from "@/hooks/usePagination";

import PromotionTableRow from "./PromotionTableRow";

const PromotionTable = ({ promotions = [], onDelete, deletingPromotionId }) => {
  const { currentPage, setCurrentPage, totalPages, paginatedItems } =
    usePagination({
      items: promotions,
      itemsPerPage: 10,
      resetKey: promotions.length,
    });

  return (
    <Card className="border border-base-200 shadow-sm">
      <div className="card-body">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <CardTitle>Promosyon Listesi</CardTitle>

            <p className="text-sm text-base-content/70">
              Toplam {promotions.length} promosyon listeleniyor
            </p>
          </div>

          <Search placeholder="Promosyon ara..." />
        </div>

        <div className="overflow-x-auto rounded-xl border border-base-200">
          <table className="table table-zebra">
            <thead className="bg-base-200/60">
              <tr>
                <th>Promosyon</th>

                <th>İndirim</th>

                <th>Başlangıç</th>

                <th>Bitiş</th>

                <th>Sıra</th>

                <th>Durum</th>

                <th className="text-center">İşlemler</th>
              </tr>
            </thead>

            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((promotion) => (
                  <PromotionTableRow
                    key={promotion.id}
                    promotion={promotion}
                    onDelete={onDelete}
                    isDeleting={deletingPromotionId === promotion.id}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-base-content/60"
                  >
                    Henüz promosyon bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default PromotionTable;
