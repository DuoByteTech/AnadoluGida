import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CategoryHeader from "../components/categoriesPage/CategoryHeader";
import CategoryTable from "../components/categoriesPage/CategoryTable";

import { deleteCategory, getCategories } from "../services/category.service";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getCategories();

      setCategories(data);
    } catch (err) {
      console.error("Kategoriler yüklenirken hata oluştu:", err);

      setError("Kategoriler yüklenirken bir hata oluştu.");

      toast.error("Kategoriler yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDeleteCategory = async (id) => {
    if (!id) {
      return;
    }

    try {
      await deleteCategory(id);

      setCategories((prev) => prev.filter((category) => category.id !== id));

      toast.success("Kategori başarıyla silindi.");
    } catch (err) {
      console.error("Kategori silinirken hata oluştu:", err);

      if (err?.code === "23503") {
        toast.error(
          "Bu kategori silinemiyor. Kategoriye bağlı alt kategoriler veya ürünler bulunuyor.",
        );
        return;
      }

      toast.error(
        "Kategori silinemedi. Bu kategoriye bağlı kayıtlar olabilir.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <CategoryHeader />

        <div className="alert alert-error">
          <span>{error}</span>

          <button type="button" className="btn btn-sm" onClick={loadCategories}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryHeader />

      <CategoryTable categories={categories} onDelete={handleDeleteCategory} />
    </div>
  );
};

export default CategoriesPage;
