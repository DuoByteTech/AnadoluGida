import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CategoryForm from "../components/categoriesPage/CategoryForm";

import { getCategoryById } from "../services/category.service";

const CategoryFormPage = () => {
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadCategory = async () => {
      try {
        setIsLoading(true);
        setError("");

        const category = await getCategoryById(id);

        setInitialData(category);
      } catch (err) {
        console.error("Kategori yüklenirken hata oluştu:", err);

        setError("Kategori bilgileri yüklenemedi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [id, isEditMode]);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return <CategoryForm isEditMode={isEditMode} initialData={initialData} />;
};

export default CategoryFormPage;
