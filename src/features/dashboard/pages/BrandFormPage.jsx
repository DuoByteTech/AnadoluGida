import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import BrandForm from "../components/brandsPage/BrandForm";

import { getBrandById } from "../services/brand.service";

const BrandFormPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [initialData, setInitialData] = useState(null);

  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    let isMounted = true;

    const loadBrand = async () => {
      try {
        setIsLoading(true);

        const brand = await getBrandById(id);

        if (!isMounted) {
          return;
        }

        setInitialData(brand);
      } catch (err) {
        console.error("Marka yüklenirken hata oluştu:", err);

        if (!isMounted) {
          return;
        }

        toast.error("Marka bilgileri yüklenemedi.");

        navigate("/dashboard/brands", {
          replace: true,
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBrand();

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return <BrandForm isEditMode={isEditMode} initialData={initialData} />;
};

export default BrandFormPage;
