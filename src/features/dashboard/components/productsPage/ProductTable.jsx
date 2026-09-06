import Card from "@/components/ui/Card";
import Search from "@/components/ui/Search";
import { CardTitle } from "@/components/ui/Typography";
import Pagination from "@/components/ui/Pagination";
import ProductTableRow from "./ProductTableRow";
import usePagination from "@/hooks/usePagination";
import { formatCategoryName } from "@/utils/formatters";

const ProductTable = ({ products, onDelete }) => {
  const { currentPage, setCurrentPage, totalPages, paginatedItems } =
    usePagination({
      items: products,
      itemsPerPage: 10,
      resetKey: products.length,
    });

  return (
    <Card className="border border-base-200 shadow-sm">
      <div className="card-body">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Ürün Listesi</CardTitle>

            <p className="text-sm text-base-content/70">
              Toplam {products.length} ürün listeleniyor
            </p>
          </div>

          <Search />
        </div>

        <div className="overflow-x-auto rounded-xl border border-base-200">
          <table className="table table-zebra">
            <thead className="bg-base-200/60">
              <tr>
                <th>Ürün</th>
                <th>Kategori</th>
                <th>Alt Kategori</th>
                <th>Marka</th>
                <th>Fiyat</th>
                <th>Durum</th>
                <th className="text-center">İşlemler</th>
              </tr>
            </thead>

            <tbody>
              {paginatedItems.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  formatCategoryName={formatCategoryName}
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

export default ProductTable;
