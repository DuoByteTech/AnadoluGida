import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import SubCategoryForm from "../components/subCategoriesPage/SubCategoryForm";

import { getSubCategoryById } from "../services/subCategory.service";

const SubCategoryFormPage = () => {
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

    const loadSubCategory = async () => {
      try {
        setIsLoading(true);

        const data = await getSubCategoryById(id);

        if (!isMounted) {
          return;
        }

        setInitialData(data);
      } catch (err) {
        console.error("Alt kategori yüklenirken hata oluştu:", err);

        if (!isMounted) {
          return;
        }

        toast.error("Alt kategori bilgileri yüklenemedi.");

        navigate("/dashboard/subcategories", {
          replace: true,
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSubCategory();

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

  return <SubCategoryForm isEditMode={isEditMode} initialData={initialData} />;
};

export default SubCategoryFormPage;
