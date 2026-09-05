import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";

const CategoryForm = ({ isEditMode, initialData }) => {
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
      alert("Kategori adı boş bırakılamaz.");
      return;
    }

    if (isEditMode) {
      console.log("Kategori güncellendi:", {
        id: initialData?.id,
        ...formData,
      });
    } else {
      console.log("Yeni kategori eklendi:", {
        id: Date.now(),
        ...formData,
        slug: formData.name.toLowerCase().replaceAll(" ", "-"),
        productCount: 0,
      });
    }

    navigate("/dashboard/categories");
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
        url={"categories"}
        linkText={"Kategorilere Dön"}
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
              to="/dashboard/categories"
              className="btn btn-outline rounded-xl"
            >
              İptal
            </Link>

            <button
              type="submit"
              className="btn btn-primary rounded-xl"
            >
              {isEditMode ? "Kategoriyi Güncelle" : "Kategori Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;