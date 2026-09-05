import { useState } from "react";
import { products as initialProducts } from "@/features/shop/data/products";
import ProductHeader from "../components/productsPage/ProductHeader";
import ProductTable from "../components/productsPage/ProductTable";

const ProductsPage = () => {
  const [products, setProducts] = useState(initialProducts);

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <ProductHeader />
      <ProductTable
        products={products}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductsPage;