import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PromotionHeader from "../components/promotionsPage/PromotionHeader";
import PromotionTable from "../components/promotionsPage/PromotionTable";

import { deletePromotion, getPromotions } from "../services/promotion.service";

import { deletePromotionImage } from "../services/promotionImage.service";

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

      toast.error("Promosyonlar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleDeletePromotion = async (id) => {
    if (!id) {
      return false;
    }

    if (deletingPromotionId) {
      return false;
    }

    const promotion = promotions.find((item) => item.id === id);

    if (!promotion) {
      toast.error("Silinecek promosyon bulunamadı.");
      return false;
    }

    try {
      setDeletingPromotionId(id);

      /*
       * Önce DB kaydını siliyoruz.
       *
       * delete-promotion-image Edge Function'ımız
       * promosyon DB'de artık bulunmasa bile
       * promotions/{promotionId}/ prefix kontrolüyle
       * orphan R2 dosyasını temizleyebiliyor.
       */
      await deletePromotion(id);

      let imageDeleteFailed = false;

      /*
       * Promosyona bağlı R2 görseli varsa temizle.
       *
       * DB silme başarılı olduğu için R2 silme
       * başarısız olursa promosyonu geri getirmiyoruz.
       * Sadece orphan dosya kalmış olur.
       */
      if (promotion.imageObjectKey) {
        try {
          await deletePromotionImage({
            promotionId: id,
            objectKey: promotion.imageObjectKey,
          });
        } catch (imageDeleteError) {
          console.error(
            "Promosyon silindi fakat R2 görseli temizlenemedi:",
            imageDeleteError,
          );

          imageDeleteFailed = true;
        }
      }

      setPromotions((prev) => prev.filter((item) => item.id !== id));

      if (imageDeleteFailed) {
        toast.success("Promosyon başarıyla silindi.");

        toast.error(
          "Promosyon silindi ancak görsel R2 üzerinden temizlenemedi.",
        );
      } else {
        toast.success("Promosyon başarıyla silindi.");
      }

      return true;
    } catch (err) {
      console.error("Promosyon silinirken hata oluştu:", err);

      if (err?.code === "23503") {
        toast.error(
          "Promosyon silinemiyor. Promosyona bağlı kayıtlar bulunuyor.",
        );

        return false;
      }

      toast.error("Promosyon silinirken bir hata oluştu.");

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
