import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "../PageHeader";

import { getCategories } from "../../services/category.service";
import { getSubCategories } from "../../services/subCategory.service";
import { getBrands } from "../../services/brand.service";

import {
  createProduct,
  createProductImages,
  updateProduct,
} from "../../services/product.service";

import { uploadProductImages } from "../../services/productImage.service";

const ProductForm = ({ isEditMode, initialData }) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    subcategoryId: "",
    brandId: "",
    price: "",
    oldPrice: "",
    images: [],
    isDiscounted: false,
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
      oldPrice: initialData?.oldPrice ?? "",
      images: [],
      isDiscounted: initialData?.isDiscounted ?? false,
      isActive: initialData?.isActive ?? true,
    });
  }, [initialData]);

  const filteredSubcategories = useMemo(() => {
    if (!formData.categoryId) {
      return [];
    }

    return subcategories.filter(
      (subcategory) => subcategory.categoryId === formData.categoryId,
    );
  }, [subcategories, formData.categoryId]);

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

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
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

    if (formData.oldPrice !== "" && Number(formData.oldPrice) < 0) {
      alert("Eski fiyat 0 veya daha büyük olmalıdır.");

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

      oldPrice: formData.oldPrice !== "" ? Number(formData.oldPrice) : null,

      isDiscounted: formData.isDiscounted,
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

      if (formData.images.length > 0) {
        const uploadedImages = await uploadProductImages({
          files: formData.images,
          productId: product.id,
        });

        await createProductImages({
          productId: product.id,
          images: uploadedImages,
        });
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
            ? "Ürün bilgilerini buradan güncelleyebilirsiniz."
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              <legend className="fieldset-legend">Eski Fiyat</legend>

              <input
                type="number"
                min="0"
                step="0.01"
                name="oldPrice"
                className="input input-bordered w-full"
                placeholder="3.19"
                value={formData.oldPrice}
                onChange={handleChange}
                disabled={isSubmitting}
              />
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
          </fieldset>

          <div className="flex flex-wrap gap-6">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                name="isDiscounted"
                className="checkbox"
                checked={formData.isDiscounted}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              İndirimli
            </label>

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
