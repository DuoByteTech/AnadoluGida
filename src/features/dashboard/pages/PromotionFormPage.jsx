import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PromotionForm from "../components/promotionsPage/PromotionForm";
import { getPromotionById } from "../services/promotion.service";

const PromotionFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }
    let isMounted = true;
    const loadPromotion = async () => {
      try {
        setIsLoading(true);

        setError("");
        const promotion = await getPromotionById(id);

        if (!isMounted) {
          return;
        }
        setInitialData(promotion);
      } catch (err) {
        console.error("Promosyon yüklenirken hata oluştu:", err);
        if (isMounted) {
          setError("Promosyon bilgileri yüklenemedi.");
        }
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

  return <PromotionForm isEditMode={isEditMode} initialData={initialData} />;
};

export default PromotionFormPage;
