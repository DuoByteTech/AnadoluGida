import { useParams } from "react-router-dom";
import { products } from "@/features/shop/data/products";
import ProductForm from "./ProductForm";

const ProductFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const selectedProduct = isEditMode
    ? products.find((item) => item.id === Number(id))
    : null;

  return (
    <ProductForm
      isEditMode={isEditMode}
      initialData={selectedProduct}
    />
  );
};

export default ProductFormPage;