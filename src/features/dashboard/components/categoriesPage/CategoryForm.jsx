import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "../PageHeader";

import {
  createCategory,
  updateCategory,
} from "../../services/category.service";

const createSlug = (value) => {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const CategoryForm = ({ isEditMode, initialData }) => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    sortOrder: initialData?.sortOrder ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      sortOrder: initialData?.sortOrder ?? 0,
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

  const handleNameChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      name: value,

      slug:
        !isEditMode || prev.slug === createSlug(prev.name)
          ? createSlug(value)
          : prev.slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const name = formData.name.trim();

    const slug = formData.slug.trim() || createSlug(name);

    if (!name) {
      alert("Kategori adı boş bırakılamaz.");

      return;
    }

    if (!slug) {
      alert("Geçerli bir slug oluşturulamadı.");

      return;
    }

    const sortOrder = Number(formData.sortOrder);

    if (Number.isNaN(sortOrder) || sortOrder < 0) {
      alert("Sıralama değeri 0 veya daha büyük olmalıdır.");

      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name,
        slug,
        description: formData.description,
        isActive: formData.isActive,
        sortOrder,
      };

      if (isEditMode) {
        await updateCategory(initialData.id, payload);
      } else {
        await createCategory(payload);
      }

      navigate("/dashboard/categories");
    } catch (err) {
      console.error("Kategori kaydedilirken hata oluştu:", err);

      if (err?.code === "23505") {
        alert("Bu kategori adı veya slug zaten kullanılıyor.");

        return;
      }

      alert("Kategori kaydedilirken bir hata oluştu.");
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
              onChange={handleNameChange}
              disabled={isSubmitting}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Slug</legend>

            <input
              type="text"
              name="slug"
              className="input input-bordered w-full"
              placeholder="meyve-sebze"
              value={formData.slug}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Açıklama</legend>

            <textarea
              name="description"
              className="textarea textarea-bordered min-h-28 w-full"
              placeholder="Kategori açıklaması..."
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Sıralama</legend>

            <input
              type="number"
              min="0"
              step="1"
              name="sortOrder"
              className="input input-bordered w-full"
              value={formData.sortOrder}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </fieldset>

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
