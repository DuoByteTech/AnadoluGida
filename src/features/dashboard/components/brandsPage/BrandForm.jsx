import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "../PageHeader";

import { createBrand, updateBrand } from "../../services/brand.service";

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

const BrandForm = ({ isEditMode, initialData }) => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    websiteUrl: initialData?.websiteUrl || "",
    sortOrder: initialData?.sortOrder ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      websiteUrl: initialData?.websiteUrl || "",
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

    if (!name) {
      alert("Marka adı boş bırakılamaz.");

      return;
    }

    const slug = formData.slug.trim() || createSlug(name);

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

        websiteUrl: formData.websiteUrl,

        isActive: formData.isActive,

        sortOrder,
      };

      if (isEditMode) {
        await updateBrand(initialData.id, payload);
      } else {
        await createBrand(payload);
      }

      navigate("/dashboard/brands");
    } catch (err) {
      console.error("Marka kaydedilirken hata oluştu:", err);

      if (err?.code === "23505") {
        alert("Bu marka adı veya slug zaten kullanılıyor.");

        return;
      }

      alert("Marka kaydedilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Marka Düzenle" : "Yeni Marka"}
        description={
          isEditMode
            ? "Marka bilgilerini buradan güncelleyebilirsiniz."
            : "Yeni marka ekleyebilirsiniz."
        }
        url="brands"
        linkText="Markalara Dön"
      />

      <div className="rounded-xl bg-base-100 p-6 shadow-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Marka Adı</legend>

            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              placeholder="Örn: Sera"
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
              placeholder="sera"
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
              placeholder="Marka açıklaması..."
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Web Sitesi</legend>

            <input
              type="url"
              name="websiteUrl"
              className="input input-bordered w-full"
              placeholder="https://example.com"
              value={formData.websiteUrl}
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
              to="/dashboard/brands"
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
                  ? "Markayı Güncelle"
                  : "Marka Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandForm;
