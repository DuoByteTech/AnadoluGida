import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BrandForm from "../components/brandsPage/BrandForm";

import { getBrandById } from "../services/brand.service";

const BrandFormPage = () => {
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadBrand = async () => {
      try {
        setIsLoading(true);
        setError("");

        const brand = await getBrandById(id);

        setInitialData(brand);
      } catch (err) {
        console.error("Marka yüklenirken hata oluştu:", err);

        setError("Marka bilgileri yüklenemedi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBrand();
  }, [id, isEditMode]);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return <BrandForm isEditMode={isEditMode} initialData={initialData} />;
};

export default BrandFormPage;
