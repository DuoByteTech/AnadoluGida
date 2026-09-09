import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProductForm from "./ProductForm";

import { getProductById } from "../../services/product.service";

const ProductFormPage = () => {
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

    const loadProduct = async () => {
      try {
        setIsLoading(true);

        const product = await getProductById(id);

        if (!isMounted) {
          return;
        }

        setInitialData(product);
      } catch (err) {
        console.error("Ürün yüklenirken hata oluştu:", err);

        if (!isMounted) {
          return;
        }

        toast.error("Ürün bilgileri yüklenemedi.");

        navigate("/dashboard/products", {
          replace: true,
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

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

  return <ProductForm isEditMode={isEditMode} initialData={initialData} />;
};

export default ProductFormPage;
