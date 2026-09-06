import { useEffect, useState } from "react";

import BrandHeader from "../components/brandsPage/BrandHeader";
import BrandTable from "../components/brandsPage/BrandTable";

import { deleteBrand, getBrands } from "../services/brand.service";

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBrands = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getBrands();

      setBrands(data);
    } catch (err) {
      console.error("Markalar yüklenirken hata oluştu:", err);

      setError("Markalar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleDeleteBrand = async (id) => {
    try {
      await deleteBrand(id);

      setBrands((prev) => prev.filter((brand) => brand.id !== id));
    } catch (err) {
      console.error("Marka silinirken hata oluştu:", err);

      alert("Marka silinemedi.");
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
        <BrandHeader />

        <div className="alert alert-error">
          <span>{error}</span>

          <button type="button" className="btn btn-sm" onClick={loadBrands}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BrandHeader />

      <BrandTable brands={brands} onDelete={handleDeleteBrand} />
    </div>
  );
};

export default BrandsPage;
