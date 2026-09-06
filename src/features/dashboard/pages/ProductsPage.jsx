import { useEffect, useState } from "react";

import ProductHeader from "../components/productsPage/ProductHeader";
import ProductTable from "../components/productsPage/ProductTable";

import { deleteProduct, getProducts } from "../services/product.service";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data);
    } catch (err) {
      console.error("Ürünler yüklenirken hata oluştu:", err);

      setError("Ürünler yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);

      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Ürün silinirken hata oluştu:", err);

      alert("Ürün silinemedi.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ProductHeader />

        <div className="alert alert-error">
          <span>{error}</span>

          <button type="button" className="btn btn-sm" onClick={loadProducts}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductHeader />

      <ProductTable products={products} onDelete={handleDeleteProduct} />
    </div>
  );
};

export default ProductsPage;
