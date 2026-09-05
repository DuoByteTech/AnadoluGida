import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";
import { categories } from "../../data/categories";

const SubCategoryForm = ({ isEditMode, initialData }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: initialData?.category || "",
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

    if (!formData.category) {
      alert("Lütfen bir kategori seçin.");
      return;
    }

    if (!formData.name.trim()) {
      alert("Alt kategori adı boş bırakılamaz.");
      return;
    }

    if (isEditMode) {
      console.log("Alt kategori güncellendi:", {
        id: initialData?.id,
        ...formData,
      });
    } else {
      console.log("Yeni alt kategori eklendi:", {
        id: Date.now(),
        ...formData,
      });
    }

    navigate("/dashboard/subcategories");
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
        url={"subcategories"}
        linkText={"Alt Kategorilere Dön"}
      />

      <div className="rounded-xl bg-base-100 p-6 shadow-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Kategori Seç</legend>
            <select
              name="category"
              className="select select-bordered w-full"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Kategori seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
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
              to="/dashboard/subCategories"
              className="btn btn-outline rounded-xl"
            >
              İptal
            </Link>

            <button
              type="submit"
              className="btn btn-primary rounded-xl"
            >
              {isEditMode ? "Alt Kategoriyi Güncelle" : "Alt Kategori Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCategoryForm;