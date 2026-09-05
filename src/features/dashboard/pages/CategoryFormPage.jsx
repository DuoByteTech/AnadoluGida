import { useParams } from "react-router-dom";
import { categories } from "../data/categories";
import CategoryForm from "../components/categoriesPage/CategoryForm";

const CategoryFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const selectedCategory = isEditMode
    ? categories.find((item) => item.id === Number(id))
    : null;

  return (
    <CategoryForm
      isEditMode={isEditMode}
      initialData={selectedCategory}
    />
  );
};

export default CategoryFormPage;