import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductForm from "./ProductForm";

import { getProductById } from "../../services/product.service";

const ProductFormPage = () => {
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [initialData, setInitialData] = useState(null);

  const [isLoading, setIsLoading] = useState(isEditMode);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const product = await getProductById(id);

        setInitialData(product);
      } catch (err) {
        console.error("Ürün yüklenirken hata oluştu:", err);

        setError("Ürün bilgileri yüklenemedi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
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

  return <ProductForm isEditMode={isEditMode} initialData={initialData} />;
};

export default ProductFormPage;
