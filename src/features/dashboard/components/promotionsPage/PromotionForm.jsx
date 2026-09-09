import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../PageHeader";

import {
  createPromotion,
  updatePromotion,
} from "../../services/promotion.service";

import {
  deletePromotionImage,
  uploadPromotionImage,
} from "../../services/promotionImage.service";

const PromotionForm = ({ isEditMode = false, initialData = null }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [imageObjectKey, setImageObjectKey] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      title: initialData?.title || "",
      description: initialData?.description || "",
    });

    setImageObjectKey(initialData?.imageObjectKey ?? null);

    setExistingImage(initialData?.image ?? null);

    setSelectedImage(null);
  }, [initialData]);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Sadece JPG, PNG, WEBP veya AVIF yükleyebilirsiniz.");

      event.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Görsel boyutu en fazla 10 MB olabilir.");

      event.target.value = "";
      return;
    }

    setSelectedImage(file);
  };

  const validateForm = () => {
    const title = formData.title.trim();

    if (!title) {
      toast.error("Promosyon başlığı boş bırakılamaz.");

      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const title = formData.title.trim();
    const description = formData.description.trim();

    try {
      setIsSubmitting(true);

      const basePayload = {
        title,
        description,
      };

      if (isEditMode) {
        const promotionId = initialData.id;

        const oldImageObjectKey = imageObjectKey;

        let newImageObjectKey = oldImageObjectKey;

        if (selectedImage) {
          const uploadResult = await uploadPromotionImage({
            promotionId,
            file: selectedImage,
          });

          newImageObjectKey = uploadResult.objectKey;
        }

        await updatePromotion(promotionId, {
          ...basePayload,
          imageObjectKey: newImageObjectKey,
        });

        if (
          selectedImage &&
          oldImageObjectKey &&
          oldImageObjectKey !== newImageObjectKey
        ) {
          try {
            await deletePromotionImage({
              promotionId,
              objectKey: oldImageObjectKey,
            });
          } catch (deleteError) {
            console.error("Eski promosyon görseli silinemedi:", deleteError);

            toast.error(
              "Promosyon güncellendi ancak eski görsel R2 üzerinden temizlenemedi.",
            );
          }
        }

        toast.success("Promosyon başarıyla güncellendi.");
      } else {
        const createdPromotion = await createPromotion({
          ...basePayload,
          imageObjectKey: null,
        });

        if (selectedImage) {
          let uploadedObjectKey = null;

          try {
            const uploadResult = await uploadPromotionImage({
              promotionId: createdPromotion.id,
              file: selectedImage,
            });

            uploadedObjectKey = uploadResult.objectKey;

            await updatePromotion(createdPromotion.id, {
              ...basePayload,
              imageObjectKey: uploadedObjectKey,
            });
          } catch (uploadError) {
            if (uploadedObjectKey) {
              try {
                await deletePromotionImage({
                  promotionId: createdPromotion.id,
                  objectKey: uploadedObjectKey,
                });
              } catch (cleanupError) {
                console.error("Promosyon görseli temizlenemedi:", cleanupError);
              }
            }

            throw uploadError;
          }
        }

        toast.success("Promosyon başarıyla eklendi.");
      }

      navigate("/dashboard/promotions");
    } catch (err) {
      console.error("Promosyon kaydedilirken hata oluştu:", err);

      if (err?.code === "23505") {
        toast.error("Bu promosyon zaten kullanılıyor.");

        return;
      }

      if (err?.message === "IMAGE_TOO_LARGE") {
        toast.error("Görsel boyutu en fazla 10 MB olabilir.");

        return;
      }

      if (err?.message === "UNSUPPORTED_IMAGE_TYPE") {
        toast.error("Sadece JPG, PNG, WEBP veya AVIF yükleyebilirsiniz.");

        return;
      }

      if (err?.message?.startsWith("R2_UPLOAD_FAILED_")) {
        toast.error("Promosyon kaydedilemedi. Görsel R2'ye yüklenemedi.");

        return;
      }

      if (err?.message === "R2_DELETE_FAILED") {
        toast.error("Promosyon görseli R2 üzerinden silinemedi.");

        return;
      }

      toast.error("Promosyon kaydedilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleImage = previewUrl || existingImage;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Promosyon Düzenle" : "Yeni Promosyon"}
        description={
          isEditMode
            ? "Promosyon bilgilerini buradan güncelleyebilirsiniz."
            : "Yeni promosyon ekleyebilirsiniz."
        }
        url="promotions"
        linkText="Promosyonlara Dön"
      />

      <div className="rounded-xl bg-base-100 p-6 shadow-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Promosyon Başlığı</legend>

            <input
              type="text"
              name="title"
              className="input input-bordered w-full"
              placeholder="Örn: Haftanın Fırsatları"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Açıklama</legend>

            <textarea
              name="description"
              className="textarea textarea-bordered min-h-32 w-full"
              placeholder="Promosyon açıklaması..."
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Promosyon Görseli</legend>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="file-input file-input-bordered w-full"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />

            <p className="mt-2 text-xs text-base-content/60">
              JPG, PNG, WEBP veya AVIF — maksimum 10 MB
            </p>
          </fieldset>

          {visibleImage && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Görsel Önizleme</p>

              <div className="max-w-xl overflow-hidden rounded-xl border border-base-200 bg-base-200">
                <img
                  src={visibleImage}
                  alt="Promosyon önizleme"
                  className="aspect-[16/7] w-full object-cover"
                />
              </div>
            </div>
          )}

          {isEditMode && existingImage && !selectedImage && (
            <p className="text-xs text-base-content/60">
              Yeni görsel seçmezseniz mevcut görsel korunacaktır.
            </p>
          )}

          {selectedImage && (
            <div className="text-sm text-base-content/70">
              Seçilen görsel:{" "}
              <span className="font-medium">{selectedImage.name}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/dashboard/promotions"
              className={`btn btn-outline rounded-xl ${
                isSubmitting ? "pointer-events-none opacity-50" : ""
              }`}
            >
              İptal
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary rounded-xl"
            >
              {isSubmitting && (
                <span className="loading loading-spinner loading-sm" />
              )}

              {isSubmitting
                ? "Kaydediliyor..."
                : isEditMode
                  ? "Promosyonu Güncelle"
                  : "Promosyon Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionForm;
