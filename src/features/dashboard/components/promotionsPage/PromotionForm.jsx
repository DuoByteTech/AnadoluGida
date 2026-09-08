import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Card from "@/components/ui/Card";

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

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [imageObjectKey, setImageObjectKey] = useState(null);

  const [existingImage, setExistingImage] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setTitle(initialData.title ?? "");

    setDescription(initialData.description ?? "");

    setImageObjectKey(initialData.imageObjectKey ?? null);

    setExistingImage(initialData.image ?? null);
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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Promosyon başlığı zorunludur.");

      return;
    }

    try {
      setIsSubmitting(true);

      setError("");

      const basePayload = {
        title: title.trim(),

        description: description.trim(),
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
          }
        }
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
                console.error(
                  "Başarısız promosyon görseli temizlenemedi:",
                  cleanupError,
                );
              }
            }

            throw uploadError;
          }
        }
      }

      navigate("/dashboard/promotions");
    } catch (err) {
      console.error("Promosyon kaydedilirken hata oluştu:", err);

      setError("Promosyon kaydedilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleImage = previewUrl || existingImage;

  return (
    <div className="space-y-6">
      <Card className="border border-base-200 shadow-sm">
        <div className="card-body">
          <div>
            <h1 className="text-2xl font-bold">
              {isEditMode ? "Promosyon Düzenle" : "Yeni Promosyon"}
            </h1>

            <p className="mt-1 text-sm text-base-content/70">
              Ana sayfada gösterilecek promosyon içeriğini yönetin.
            </p>
          </div>
        </div>
      </Card>

      <Card className="border border-base-200 shadow-sm">
        <form className="card-body gap-6" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Başlık</span>
                </label>

                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Örn. Frisches Gemüse"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Açıklama</span>
                </label>

                <textarea
                  className="textarea textarea-bordered min-h-40 w-full"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Promosyon açıklaması..."
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Promosyon Görseli
                  </span>
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />

                <div className="label">
                  <span className="label-text-alt text-base-content/60">
                    JPG, PNG, WEBP veya AVIF — maksimum 10 MB
                  </span>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-base-200 bg-base-200">
                {visibleImage ? (
                  <img
                    src={visibleImage}
                    alt="Promosyon önizleme"
                    className="aspect-[16/7] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/7] items-center justify-center text-sm text-base-content/50">
                    Görsel seçilmedi
                  </div>
                )}
              </div>

              {selectedImage && (
                <div className="mt-3 rounded-xl bg-base-200 p-3 text-sm">
                  <div className="font-medium">Yeni görsel</div>

                  <div className="mt-1 truncate text-base-content/60">
                    {selectedImage.name}
                  </div>
                </div>
              )}

              {isEditMode && existingImage && !selectedImage && (
                <div className="mt-3 rounded-xl bg-base-200 p-3 text-sm">
                  <div className="font-medium">Mevcut görsel</div>

                  <div className="mt-1 text-xs text-base-content/60">
                    Yeni bir görsel seçmezseniz mevcut görsel korunacaktır.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-base-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/dashboard/promotions")}
              disabled={isSubmitting}
            >
              Vazgeç
            </button>

            <button
              type="submit"
              className="btn rounded-xl border-brand-red-700 bg-brand-red-700 text-white hover:border-brand-red-800 hover:bg-brand-red-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Kaydediliyor...
                </>
              ) : isEditMode ? (
                "Değişiklikleri Kaydet"
              ) : (
                "Promosyon Oluştur"
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PromotionForm;
