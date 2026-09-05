import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";

const BrandForm = ({ isEditMode, initialData }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Marka adı boş bırakılamaz.");
      return;
    }

    const payload = {
      id: isEditMode ? initialData?.id : Date.now(),
      name: formData.name,
      isActive: formData.isActive,
    };

    if (isEditMode) {
      console.log("Marka güncellendi:", payload);
    } else {
      console.log("Yeni marka eklendi:", payload);
    }

    navigate("/dashboard/brands");
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
            />
          </fieldset>

          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              name="isActive"
              className="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Aktif
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/dashboard/brands"
              className="btn btn-outline rounded-xl"
            >
              İptal
            </Link>

            <button
              type="submit"
              className="btn btn-primary rounded-xl"
            >
              {isEditMode ? "Markayı Güncelle" : "Marka Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandForm;