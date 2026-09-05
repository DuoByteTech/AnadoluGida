import Card from "@/components/ui/Card";
import Search from "@/components/ui/Search";
import Pagination from "@/components/ui/Pagination";
import { CardTitle } from "@/components/ui/Typography";
import usePagination from "@/hooks/usePagination";

import BrandTableRow from "./BrandTableRow";

const BrandTable = ({ brands, onDelete }) => {
  const { currentPage, setCurrentPage, totalPages, paginatedItems } =
    usePagination({
      items: brands,
      itemsPerPage: 5,
      resetKey: brands.length,
    });

  return (
    <Card className="border border-base-200 shadow-sm">
      <div className="card-body">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Marka Listesi</CardTitle>
            <p className="text-sm text-base-content/70">
              Toplam {brands.length} marka listeleniyor
            </p>
          </div>

          <Search />
        </div>

        <div className="overflow-x-auto rounded-xl border border-base-200">
          <table className="table table-zebra">
            <thead className="bg-base-200/60">
              <tr>
                <th>Marka Adı</th>
                <th>Ürün Sayısı</th>
                <th>Durum</th>
                <th className="text-center">İşlemler</th>
              </tr>
            </thead>

            <tbody>
              {paginatedItems.map((brand) => (
                <BrandTableRow
                  key={brand.id}
                  brand={brand}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </Card>
  );
};

export default BrandTable;