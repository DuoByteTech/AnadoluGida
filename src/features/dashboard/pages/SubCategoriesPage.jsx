import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import SubCategoryHeader from "../components/subCategoriesPage/SubCategoryHeader";
import SubCategoryTable from "../components/subCategoriesPage/SubCategoryTable";

import {
  deleteSubCategory,
  getSubCategories,
} from "../services/subCategory.service";

const SubCategoriesPage = () => {
  const [subcategories, setSubcategories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const loadSubCategories = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getSubCategories();

      const mappedData = data.map((item) => ({
        ...item,

        // mevcut tablo component'i
        // "category" alanını bekliyor
        category: item.categoryName,
      }));

      setSubcategories(mappedData);
    } catch (err) {
      console.error("Alt kategoriler yüklenirken hata oluştu:", err);

      setError("Alt kategoriler yüklenirken bir hata oluştu.");

      toast.error("Alt kategoriler yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      return;
    }

    try {
      await deleteSubCategory(id);

      setSubcategories((prev) => prev.filter((item) => item.id !== id));

      toast.success("Alt kategori başarıyla silindi.");
    } catch (err) {
      console.error("Alt kategori silinirken hata oluştu:", err);

      if (err?.code === "23503") {
        toast.error(
          "Bu alt kategori silinemiyor. Alt kategoriye bağlı ürünler bulunuyor.",
        );
        return;
      }

      toast.error("Alt kategori silinirken bir hata oluştu.");
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
        <SubCategoryHeader />

        <div className="alert alert-error">
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-sm"
            onClick={loadSubCategories}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubCategoryHeader />

      <SubCategoryTable subcategories={subcategories} onDelete={handleDelete} />
    </div>
  );
};

export default SubCategoriesPage;
