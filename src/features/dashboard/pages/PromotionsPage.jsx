import { useEffect, useState } from "react";

import PromotionHeader from "../components/promotionsPage/PromotionHeader";
import PromotionTable from "../components/promotionsPage/PromotionTable";

import { deletePromotion, getPromotions } from "../services/promotion.service";

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingPromotionId, setDeletingPromotionId] = useState(null);

  const loadPromotions = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getPromotions();

      setPromotions(data);
    } catch (err) {
      console.error("Promosyonlar yüklenirken hata oluştu:", err);

      setError("Promosyonlar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleDeletePromotion = async (id) => {
    if (!id) {
      return;
    }

    if (deletingPromotionId) {
      return;
    }

    try {
      setDeletingPromotionId(id);

      await deletePromotion(id);

      setPromotions((prev) => prev.filter((promotion) => promotion.id !== id));

      return true;
    } catch (err) {
      console.error("Promosyon silinirken hata oluştu:", err);

      alert("Promosyon silinemedi.");

      return false;
    } finally {
      setDeletingPromotionId(null);
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
        <PromotionHeader />

        <div className="alert alert-error">
          <span>{error}</span>

          <button type="button" className="btn btn-sm" onClick={loadPromotions}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PromotionHeader />

      <PromotionTable
        promotions={promotions}
        onDelete={handleDeletePromotion}
        deletingPromotionId={deletingPromotionId}
      />
    </div>
  );
};

export default PromotionsPage;
