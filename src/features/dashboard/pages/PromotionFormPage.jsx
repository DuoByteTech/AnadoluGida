import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import PromotionForm from "../components/promotionsPage/PromotionForm";

import { getPromotionById } from "../services/promotion.service";

const PromotionFormPage = () => {
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

    const loadPromotion = async () => {
      try {
        setIsLoading(true);

        const promotion = await getPromotionById(id);

        if (!isMounted) {
          return;
        }

        setInitialData(promotion);
      } catch (err) {
        console.error("Promosyon yüklenirken hata oluştu:", err);

        if (!isMounted) {
          return;
        }

        toast.error("Promosyon bilgileri yüklenemedi.");

        navigate("/dashboard/promotions", {
          replace: true,
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPromotion();

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

  return <PromotionForm isEditMode={isEditMode} initialData={initialData} />;
};

export default PromotionFormPage;
