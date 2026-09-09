import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../PageHeader";

import { createBrand, updateBrand } from "../../services/brand.service";

const BrandForm = ({ isEditMode, initialData }) => {
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
      toast.error("Marka adı boş bırakılamaz.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name,
        isActive: isEditMode ? formData.isActive : true,
      };

      if (isEditMode) {
        await updateBrand(initialData.id, payload);

        toast.success("Marka başarıyla güncellendi.");
      } else {
        await createBrand(payload);

        toast.success("Marka başarıyla eklendi.");
      }

      navigate("/dashboard/brands");
    } catch (err) {
      console.error("Marka kaydedilirken hata oluştu:", err);

      if (err?.code === "23505") {
        toast.error("Bu marka zaten kullanılıyor.");
        return;
      }

      toast.error("Marka kaydedilirken bir hata oluştu.");
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
