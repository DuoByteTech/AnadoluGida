import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "../PageHeader";

import { getCategories } from "../../services/category.service";
import { getSubCategories } from "../../services/subCategory.service";
import { getBrands } from "../../services/brand.service";

import {
  createProduct,
  createProductImages,
  deleteProductImageRecords,
  normalizeProductImages,
  updateProduct,
} from "../../services/product.service";

import {
  deleteProductImagesFromR2,
  uploadProductImages,
} from "../../services/productImage.service";

const ProductForm = ({ isEditMode, initialData }) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    subcategoryId: "",
    brandId: "",
    price: "",
    discountPercentage: 0,
    isActive: true,
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setIsLoadingOptions(true);

        const [categoryData, subCategoryData, brandData] = await Promise.all([
          getCategories(),
          getSubCategories(),
          getBrands(),
        ]);

        setCategories(categoryData);
        setSubcategories(subCategoryData);
        setBrands(brandData);
      } catch (err) {
        console.error("Ürün form seçenekleri yüklenirken hata oluştu:", err);

        alert("Kategori, alt kategori veya marka listesi yüklenemedi.");
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      categoryId: initialData?.categoryId || "",
      subcategoryId: initialData?.subcategoryId || "",
      brandId: initialData?.brandId || "",
      price: initialData?.price ?? "",
      discountPercentage: initialData?.discountPercentage ?? 0,
      isActive: initialData?.isActive ?? true,
    });

    setExistingImages(initialData?.images || []);
    setNewImages([]);
    setDeletedImages([]);
  }, [initialData]);

  const filteredSubcategories = useMemo(() => {
    if (!formData.categoryId) {
      return [];
    }

    return subcategories.filter(
      (subcategory) => subcategory.categoryId === formData.categoryId,
    );
  }, [subcategories, formData.categoryId]);

  const newImagePreviews = useMemo(() => {
    return newImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [newImages]);

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [newImagePreviews]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "categoryId") {
        updated.subcategoryId = "";
      }

      return updated;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    setNewImages((prev) => [...prev, ...files]);

    e.target.value = "";
  };

  const removeNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeExistingImage = (image) => {
    setExistingImages((prev) => prev.filter((item) => item.id !== image.id));

    setDeletedImages((prev) => {
      const alreadyDeleted = prev.some((item) => item.id === image.id);

      if (alreadyDeleted) {
        return prev;
      }

      return [...prev, image];
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Ürün adı boş bırakılamaz.");
      return false;
    }

    if (!formData.categoryId) {
      alert("Lütfen kategori seçin.");
      return false;
    }

    if (!formData.subcategoryId) {
      alert("Lütfen alt kategori seçin.");
      return false;
    }

    if (!formData.brandId) {
      alert("Lütfen marka seçin.");
      return false;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      alert("Geçerli bir fiyat girin.");
      return false;
    }

    const discountPercentage = Number(formData.discountPercentage);

    if (
      !Number.isFinite(discountPercentage) ||
      discountPercentage < 0 ||
      discountPercentage > 100
    ) {
      alert("İndirim oranı %0 ile %100 arasında olmalıdır.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const payload = {
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId,
      brandId: formData.brandId,

      name: formData.name.trim(),

      price: Number(formData.price),

      discountPercentage: Number(formData.discountPercentage) || 0,

      isActive: formData.isActive,
    };

    try {
      setIsSubmitting(true);

      let product;

      if (isEditMode) {
        product = await updateProduct(initialData.id, payload);
      } else {
        product = await createProduct(payload);
      }

      if (isEditMode && deletedImages.length > 0) {
        await deleteProductImagesFromR2({
          productId: product.id,
          objectKeys: deletedImages.map((image) => image.objectKey),
        });

        await deleteProductImageRecords(deletedImages.map((image) => image.id));
      }

      if (newImages.length > 0) {
        const uploadedImages = await uploadProductImages({
          files: newImages,
          productId: product.id,
        });

        await createProductImages({
          productId: product.id,
          images: uploadedImages,
          startSortOrder: existingImages.length,
          makeFirstPrimary: existingImages.length === 0,
        });
      }

      if (deletedImages.length > 0 || newImages.length > 0) {
        await normalizeProductImages(product.id);
      }

      alert(
        isEditMode ? "Ürün başarıyla güncellendi." : "Ürün başarıyla eklendi.",
      );

      navigate("/dashboard/products");
    } catch (err) {
      console.error("Ürün kaydedilirken hata oluştu:", err);

      if (err?.code === "23505") {
        alert("Bu ürün zaten kullanılıyor.");
        return;
      }

      if (err?.message === "IMAGE_TOO_LARGE") {
        alert("Görsel boyutu en fazla 10 MB olabilir.");
        return;
      }

      if (err?.message === "UNSUPPORTED_IMAGE_TYPE") {
        alert("Sadece JPG, PNG, WEBP veya AVIF yükleyebilirsiniz.");
        return;
      }

      if (err?.message?.startsWith("R2_UPLOAD_FAILED_")) {
        alert("Ürün kaydedildi ancak görsel R2'ye yüklenemedi.");
        return;
      }

      if (err?.message === "R2_DELETE_FAILED") {
        alert("Ürün görseli R2 üzerinden silinemedi.");
        return;
      }

      alert("Ürün kaydedilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Ürün Düzenle" : "Yeni Ürün"}
        description={
          isEditMode
            ? "Ürün bilgilerini ve görsellerini buradan güncelleyebilirsiniz."
            : "Yeni ürün ekleyebilirsiniz."
        }
        url="products"
        linkText="Ürünlere Dön"
      />

      <div className="rounded-xl bg-base-100 p-6 shadow-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Ürün Adı</legend>

            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              placeholder="Örn: Portakal"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </fieldset>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Kategori</legend>

              <select
                name="categoryId"
                className="select select-bordered w-full"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={isSubmitting || isLoadingOptions}
              >
                <option value="">Kategori seçin</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Alt Kategori</legend>

              <select
                name="subcategoryId"
                className="select select-bordered w-full"
                value={formData.subcategoryId}
                onChange={handleChange}
                disabled={isSubmitting || !formData.categoryId}
              >
                <option value="">Alt kategori seçin</option>

                {filteredSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Marka</legend>

              <select
                name="brandId"
                className="select select-bordered w-full"
                value={formData.brandId}
                onChange={handleChange}
                disabled={isSubmitting || isLoadingOptions}
              >
                <option value="">Marka seçin</option>

                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Fiyat</legend>

              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                className="input input-bordered w-full"
                placeholder="2.49"
                value={formData.price}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">İndirim Oranı</legend>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  name="discountPercentage"
                  className="input input-bordered w-full pr-10"
                  placeholder="20"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60">
                  %
                </span>
              </div>
            </fieldset>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Ürün Görselleri</legend>

            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="file-input file-input-bordered w-full"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />

            <div className="mt-2 space-y-1 text-sm text-base-content/60">
              <p>Birden fazla görsel seçebilirsiniz.</p>
              <p>Desteklenen formatlar: JPG, PNG, WEBP ve AVIF.</p>
              <p>Her görsel en fazla 10 MB olabilir.</p>
            </div>

            {(existingImages.length > 0 || newImagePreviews.length > 0) && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {existingImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-xl border border-base-300 bg-base-200"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.url}
                        alt={`Ürün görseli ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {index === 0 && (
                      <span className="badge badge-primary absolute left-2 top-2">
                        Ana Görsel
                      </span>
                    )}

                    <button
                      type="button"
                      className="btn btn-error btn-circle btn-sm absolute right-2 top-2"
                      onClick={() => removeExistingImage(image)}
                      disabled={isSubmitting}
                      aria-label="Görseli kaldır"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {newImagePreviews.map((image, index) => {
                  const isPrimary = existingImages.length === 0 && index === 0;

                  return (
                    <div
                      key={`${image.file.name}-${image.file.lastModified}-${index}`}
                      className="group relative overflow-hidden rounded-xl border border-dashed border-primary bg-base-200"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={image.url}
                          alt={`Yeni ürün görseli ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {isPrimary && (
                        <span className="badge badge-primary absolute left-2 top-2">
                          Ana Görsel
                        </span>
                      )}

                      <span className="badge badge-info absolute bottom-2 left-2">
                        Yeni
                      </span>

                      <button
                        type="button"
                        className="btn btn-error btn-circle btn-sm absolute right-2 top-2"
                        onClick={() => removeNewImage(index)}
                        disabled={isSubmitting}
                        aria-label="Yeni görseli kaldır"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {existingImages.length === 0 && newImagePreviews.length === 0 && (
              <div className="mt-4 rounded-xl border border-dashed border-base-300 p-6 text-center text-sm text-base-content/50">
                Henüz ürün görseli eklenmedi.
              </div>
            )}
          </fieldset>

          <div className="flex flex-wrap gap-6">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                name="isActive"
                className="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Aktif
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/dashboard/products"
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
                  ? "Ürünü Güncelle"
                  : "Ürün Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
