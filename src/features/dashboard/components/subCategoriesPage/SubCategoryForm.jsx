import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "../PageHeader";

import { getCategories } from "../../services/category.service";

import {
  createSubCategory,
  updateSubCategory,
} from "../../services/subCategory.service";

const SubCategoryForm = ({ isEditMode, initialData }) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    categoryId: initialData?.categoryId || "",
    name: initialData?.name || "",
    isActive: initialData?.isActive ?? true,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);

        const data = await getCategories();

        setCategories(data);
      } catch (err) {
        console.error("Kategoriler yüklenirken hata oluştu:", err);

        alert("Kategori listesi yüklenemedi.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    setFormData({
      categoryId: initialData?.categoryId || "",
      name: initialData?.name || "",
      isActive: initialData?.isActive ?? true,
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!formData.categoryId) {
      alert("Lütfen bir kategori seçin.");
      return;
    }

    const name = formData.name.trim();

    if (!name) {
      alert("Alt kategori adı boş bırakılamaz.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        categoryId: formData.categoryId,
        name,
        isActive: isEditMode ? formData.isActive : true,
      };

      if (isEditMode) {
        await updateSubCategory(initialData.id, payload);
      } else {
        await createSubCategory(payload);
      }

      navigate("/dashboard/subcategories");
    } catch (err) {
      console.error("Alt kategori kaydedilirken hata oluştu:", err);

      if (err?.code === "23505") {
        alert("Bu alt kategori zaten kullanılıyor.");
        return;
      }

      alert("Alt kategori kaydedilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Alt Kategori Düzenle" : "Yeni Alt Kategori"}
        description={
          isEditMode
            ? "Alt kategori bilgilerini buradan güncelleyebilirsiniz."
            : "Yeni alt kategori ekleyebilirsiniz."
        }
        url="subcategories"
        linkText="Alt Kategorilere Dön"
      />

      <div className="rounded-xl bg-base-100 p-6 shadow-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Kategori Seç</legend>

            <select
              name="categoryId"
              className="select select-bordered w-full"
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isSubmitting || isLoadingCategories}
            >
              <option value="">
                {isLoadingCategories
                  ? "Kategoriler yükleniyor..."
                  : "Kategori seçin"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Alt Kategori Adı</legend>

            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              placeholder="Örn: Elma"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </fieldset>

          {isEditMode && (
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
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/dashboard/subcategories"
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
                  ? "Alt Kategoriyi Güncelle"
                  : "Alt Kategori Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCategoryForm;
