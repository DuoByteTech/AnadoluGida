import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../PageHeader";

import {
  createCategory,
  updateCategory,
} from "../../services/category.service";

const CategoryForm = ({ isEditMode, initialData }) => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    isActive: initialData?.isActive ?? true,
  });

  useEffect(() => {
    setFormData({
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

    const name = formData.name.trim();

    if (!name) {
      toast.error("Kategori adı boş bırakılamaz.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name,
        isActive: isEditMode ? formData.isActive : true,
      };

      if (isEditMode) {
        await updateCategory(initialData.id, payload);

        toast.success("Kategori başarıyla güncellendi.");
      } else {
        await createCategory(payload);

        toast.success("Kategori başarıyla eklendi.");
      }

      navigate("/dashboard/categories");
    } catch (err) {
      console.error("Kategori kaydedilirken hata oluştu:", err);

      if (err?.code === "23505") {
        toast.error("Bu kategori zaten kullanılıyor.");
        return;
      }

      toast.error("Kategori kaydedilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Kategori Düzenle" : "Yeni Kategori"}
        description={
          isEditMode
            ? "Kategori bilgilerini buradan güncelleyebilirsiniz."
            : "Yeni kategori ekleyebilirsiniz."
        }
        url="categories"
        linkText="Kategorilere Dön"
      />

      <div className="rounded-xl bg-base-100 p-6 shadow-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Kategori Adı</legend>

            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              placeholder="Örn: Meyve & Sebze"
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
              to="/dashboard/categories"
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
                  ? "Kategoriyi Güncelle"
                  : "Kategori Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
