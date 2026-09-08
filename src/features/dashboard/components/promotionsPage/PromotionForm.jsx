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

const toDateTimeLocalValue = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};

const PromotionForm = ({ isEditMode = false, initialData = null }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [linkUrl, setLinkUrl] = useState("");

  const [discountPercentage, setDiscountPercentage] = useState(0);

  const [startsAt, setStartsAt] = useState("");

  const [endsAt, setEndsAt] = useState("");

  const [sortOrder, setSortOrder] = useState(0);

  const [isActive, setIsActive] = useState(true);

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

    setLinkUrl(initialData.linkUrl ?? "");

    setDiscountPercentage(initialData.discountPercentage ?? 0);

    setStartsAt(toDateTimeLocalValue(initialData.startsAt));

    setEndsAt(toDateTimeLocalValue(initialData.endsAt));

    setSortOrder(initialData.sortOrder ?? 0);

    setIsActive(initialData.isActive ?? true);

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

    const discount = Number(discountPercentage);

    if (Number.isNaN(discount) || discount < 0 || discount > 100) {
      setError("İndirim oranı 0 ile 100 arasında olmalıdır.");

      return;
    }

    const order = Number(sortOrder);

    if (Number.isNaN(order) || order < 0) {
      setError("Sıralama değeri 0 veya daha büyük olmalıdır.");

      return;
    }

    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
      setError("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.");

      return;
    }

    try {
      setIsSubmitting(true);

      setError("");

      const basePayload = {
        title: title.trim(),

        description: description.trim(),

        linkUrl: linkUrl.trim(),

        discountPercentage: discount,

        startsAt: startsAt ? new Date(startsAt).toISOString() : null,

        endsAt: endsAt ? new Date(endsAt).toISOString() : null,

        sortOrder: order,

        isActive,
      };

      /*
       * =========================================
       * EDIT
       * =========================================
       */

      if (isEditMode) {
        const promotionId = initialData.id;

        const oldImageObjectKey = imageObjectKey;

        let newImageObjectKey = oldImageObjectKey;

        /*
         * Yeni görsel seçilmişse önce R2'ye yükle.
         *
         * Eski görseli burada silmiyoruz.
         * Önce DB'nin yeni görselle başarıyla
         * güncellenmesini bekliyoruz.
         */
        if (selectedImage) {
          const uploadResult = await uploadPromotionImage({
            promotionId,

            file: selectedImage,
          });

          newImageObjectKey = uploadResult.objectKey;
        }

        /*
         * DB update.
         */
        await updatePromotion(promotionId, {
          ...basePayload,

          imageObjectKey: newImageObjectKey,
        });

        /*
         * DB başarıyla yeni görsele geçtiyse
         * eski R2 dosyasını temizle.
         */
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
            /*
             * DB update başarılı olduğu için burada
             * tüm kaydetme işlemini başarısız saymıyoruz.
             *
             * Sadece eski R2 dosyası orphan kalabilir.
             */
            console.error("Eski promosyon görseli silinemedi:", deleteError);
          }
        }
      } else {
        /*
         * =========================================
         * CREATE
         * =========================================
         */

        /*
         * Edge Function promotionId istediği için
         * önce promosyon DB'de oluşturuluyor.
         */
        const createdPromotion = await createPromotion({
          ...basePayload,

          imageObjectKey: null,
        });

        /*
         * Görsel seçilmemişse promosyon burada hazır.
         */
        if (selectedImage) {
          let uploadedObjectKey = null;

          try {
            /*
             * R2 upload.
             */
            const uploadResult = await uploadPromotionImage({
              promotionId: createdPromotion.id,

              file: selectedImage,
            });

            uploadedObjectKey = uploadResult.objectKey;

            /*
             * Upload tamamlandıktan sonra object key'i
             * promotions tablosuna yaz.
             */
            await updatePromotion(createdPromotion.id, {
              ...basePayload,

              imageObjectKey: uploadedObjectKey,
            });
          } catch (uploadError) {
            /*
             * R2 upload başarılı olmuş ancak DB update
             * başarısız olmuş olabilir.
             *
             * Böyle bir durumda orphan dosya bırakmamak
             * için yüklenen dosyayı temizlemeye çalış.
             */
            if (uploadedObjectKey) {
              try {
                await deletePromotionImage({
                  promotionId: createdPromotion.id,

                  objectKey: uploadedObjectKey,
                });
              } catch (cleanupError) {
                console.error(
                  "Başarısız promosyon upload temizlenemedi:",
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
              Ana sayfada gösterilecek kampanya bilgilerini yönetin.
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
                  placeholder="Örn. Yaz İndirimi"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Açıklama</span>
                </label>

                <textarea
                  className="textarea textarea-bordered min-h-32 w-full"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Promosyon açıklaması..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Yönlendirme Linki
                  </span>
                </label>

                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={linkUrl}
                  onChange={(event) => setLinkUrl(event.target.value)}
                  placeholder="/angebote"
                  disabled={isSubmitting}
                />

                <div className="label">
                  <span className="label-text-alt text-base-content/60">
                    Örn. /angebote veya /shop?discount=true
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">İndirim %</span>
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="input input-bordered w-full"
                    value={discountPercentage}
                    onChange={(event) =>
                      setDiscountPercentage(event.target.value)
                    }
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Sıralama</span>
                  </label>

                  <input
                    type="number"
                    min="0"
                    className="input input-bordered w-full"
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Başlangıç</span>
                  </label>

                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={startsAt}
                    onChange={(event) => setStartsAt(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Bitiş</span>
                  </label>

                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={endsAt}
                    onChange={(event) => setEndsAt(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                  disabled={isSubmitting}
                />

                <div>
                  <div className="font-medium">Promosyon Aktif</div>

                  <div className="text-xs text-base-content/60">
                    Pasif promosyonlar müşterilere gösterilmez.
                  </div>
                </div>
              </label>
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
