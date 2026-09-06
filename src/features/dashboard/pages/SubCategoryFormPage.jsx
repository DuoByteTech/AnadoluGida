import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SubCategoryForm from "../components/subCategoriesPage/SubCategoryForm";

import { getSubCategoryById } from "../services/subCategory.service";

const SubCategoryFormPage = () => {
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadSubCategory = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getSubCategoryById(id);

        setInitialData(data);
      } catch (err) {
        console.error("Alt kategori yüklenirken hata oluştu:", err);

        setError("Alt kategori bilgileri yüklenemedi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubCategory();
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

  return <SubCategoryForm isEditMode={isEditMode} initialData={initialData} />;
};

export default SubCategoryFormPage;
