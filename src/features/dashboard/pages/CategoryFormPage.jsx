import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import CategoryForm from "../components/categoriesPage/CategoryForm";

import { getCategoryById } from "../services/category.service";

const CategoryFormPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    let isMounted = true;

    const loadCategory = async () => {
      try {
        setIsLoading(true);

        const category = await getCategoryById(id);

        if (!isMounted) {
          return;
        }

        setInitialData(category);
      } catch (err) {
        console.error("Kategori yüklenirken hata oluştu:", err);

        if (!isMounted) {
          return;
        }

        toast.error("Kategori bilgileri yüklenemedi.");

        navigate("/dashboard/categories", {
          replace: true,
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCategory();

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return <CategoryForm isEditMode={isEditMode} initialData={initialData} />;
};

export default CategoryFormPage;
