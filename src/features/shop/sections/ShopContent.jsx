import ProductCard from "@/features/shop/components/ProductCard";

import Pagination from "@/components/ui/Pagination";

import usePagination from "@/hooks/usePagination";

const ShopContent = ({ filteredProducts = [] }) => {
  const { currentPage, setCurrentPage, totalPages, paginatedItems } =
    usePagination({
      items: filteredProducts,
      itemsPerPage: 12,
      resetKey: filteredProducts.length,
    });

  return (
    <>
      <div className="mb-10 grid grid-cols-2 gap-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default ShopContent;
