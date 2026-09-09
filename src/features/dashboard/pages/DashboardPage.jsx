import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardHeader from "@/features/dashboard/components/dashboardPage/DashboardHeader";
import DashboardStats from "@/features/dashboard/components/dashboardPage/DashboardStats";
import ProductTable from "@/features/dashboard/components/productsPage/ProductTable";

import { getDashboardData } from "@/features/dashboard/services/dashboard.service";
import { deleteProduct } from "@/features/dashboard/services/product.service";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    categories: 0,
    subcategories: 0,
    brands: 0,
    products: 0,
    discountedProducts: 0,
  });

  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getDashboardData();

      setStats(data.stats);

      setProducts(data.products);
    } catch (err) {
      console.error("Dashboard verileri yüklenemedi:", err);

      setError("Dashboard verileri yüklenirken bir hata oluştu.");

      toast.error("Dashboard verileri yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleDeleteProduct = async (id) => {
    if (!id) {
      return;
    }

    try {
      await deleteProduct(id);

      const deletedProduct = products.find((product) => product.id === id);

      setProducts((prev) => prev.filter((product) => product.id !== id));

      setStats((prev) => ({
        ...prev,

        products: Math.max(0, prev.products - 1),

        discountedProducts: deletedProduct?.isDiscounted
          ? Math.max(0, prev.discountedProducts - 1)
          : prev.discountedProducts,
      }));

      toast.success("Ürün başarıyla silindi.");
    } catch (err) {
      console.error("Ürün silinirken hata oluştu:", err);

      if (err?.code === "23503") {
        toast.error("Ürün silinemiyor. Ürüne bağlı kayıtlar bulunuyor.");

        return;
      }

      toast.error("Ürün silinirken bir hata oluştu.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <DashboardHeader discountedProductCount={stats.discountedProducts} />

        <div className="alert alert-error">
          <span>{error}</span>

          <button type="button" className="btn btn-sm" onClick={loadDashboard}>
            Tekrar Dene
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <DashboardHeader discountedProductCount={stats.discountedProducts} />

      <DashboardStats stats={stats} />

      <ProductTable products={products} onDelete={handleDeleteProduct} />
    </section>
  );
};

export default DashboardPage;
