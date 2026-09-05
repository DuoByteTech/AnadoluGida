import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";
import { categories } from "../../data/categories";
import { subcategories } from "../../data/subcategories";
import { products } from "@/features/shop/data/products";

const ProductForm = ({ isEditMode, initialData }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    subcategory: initialData?.subcategory || "",
    brand: initialData?.brand || "",
    price: initialData?.price || "",
    oldPrice: initialData?.oldPrice || "",
    badge: initialData?.badge || "",
    color: initialData?.color || "",
    rating: initialData?.rating || "",
    images: [],
    isDiscounted: initialData?.isDiscounted ?? false,
    isActive: initialData?.isActive ?? true,
  });

  const brandOptions = useMemo(() => {
    const uniqueBrands = [...new Set(products.map((item) => item.brand).filter(Boolean))];
    return uniqueBrands.sort((a, b) => a.localeCompare(b, "tr"));
  }, []);

  const filteredSubcategories = subcategories.filter(
    (item) => item.category === formData.category
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "category") {
        updated.subcategory = "";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Ürün adı boş bırakılamaz.");
      return;
    }

    if (!formData.category) {
      alert("Lütfen kategori seçin.");
      return;
    }

    if (!formData.subcategory) {
      alert("Lütfen alt kategori seçin.");
      return;
    }

    if (!formData.brand) {
      alert("Lütfen marka seçin.");
      return;
    }

    if (!formData.price) {
      alert("Fiyat alanı boş bırakılamaz.");
      return;
    }

    const payload = {
      id: isEditMode ? initialData?.id : Date.now(),
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      brand: formData.brand,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      badge: formData.badge,
      color: formData.color,
      rating: Number(formData.rating),
      images: formData.images,
      isDiscounted: formData.isDiscounted,
      isActive: formData.isActive,
    };

    if (isEditMode) {
      console.log("Ürün güncellendi:", payload);
    } else {
      console.log("Yeni ürün eklendi:", payload);
    }

    navigate("/dashboard/products");
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
            />
          </fieldset>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Kategori</legend>
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
              <legend className="fieldset-legend">Alt Kategori</legend>
              <select
                name="subcategory"
                className="select select-bordered w-full"
                value={formData.subcategory}
                onChange={handleChange}
              >
                <option value="">Alt kategori seçin</option>
                {filteredSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.name}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Marka</legend>
              <select
                name="brand"
                className="select select-bordered w-full"
                value={formData.brand}
                onChange={handleChange}
              >
                <option value="">Marka seçin</option>
                {brandOptions.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Badge</legend>
              <input
                type="text"
                name="badge"
                className="input input-bordered w-full"
                placeholder="Örn: Frisch"
                value={formData.badge}
                onChange={handleChange}
              />
            </fieldset>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Fiyat</legend>
              <input
                type="number"
                step="0.01"
                name="price"
                className="input input-bordered w-full"
                placeholder="Örn: 2.49"
                value={formData.price}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Eski Fiyat</legend>
              <input
                type="number"
                step="0.01"
                name="oldPrice"
                className="input input-bordered w-full"
                placeholder="Örn: 3.19"
                value={formData.oldPrice}
                onChange={handleChange}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Puan</legend>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                className="input input-bordered w-full"
                placeholder="Örn: 4.7"
                value={formData.rating}
                onChange={handleChange}
              />
            </fieldset>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Renk</legend>
              <select
                name="color"
                className="select select-bordered w-full"
                value={formData.color}
                onChange={handleChange}
              >
                <option value="">Renk seçin</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="info">Info</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Ürün Görselleri</legend>
              <input
                type="file"
                multiple
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleImageChange}
              />
            </fieldset>
          </div>

          {formData.images.length > 0 && (
            <div className="rounded-xl border border-base-200 p-4">
              <p className="mb-2 text-sm font-medium">Seçilen görseller</p>
              <div className="space-y-1">
                {formData.images.map((file, index) => (
                  <div key={index} className="text-sm text-base-content/70">
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                name="isDiscounted"
                className="checkbox"
                checked={formData.isDiscounted}
                onChange={handleChange}
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
              />
              Aktif
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/dashboard/products"
              className="btn btn-outline rounded-xl"
            >
              İptal
            </Link>

            <button type="submit" className="btn btn-primary rounded-xl">
              {isEditMode ? "Ürünü Güncelle" : "Ürün Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;