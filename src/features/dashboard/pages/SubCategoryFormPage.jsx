import { useParams } from "react-router-dom";
import { subcategories } from "../data/subcategories";
import SubCategoryForm from "../components/subCategoriesPage/SubCategoryForm";

const SubCategoryFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const selectedSubCategory = isEditMode
    ? subcategories.find((item) => item.id === Number(id))
    : null;

  return (
    <SubCategoryForm
      isEditMode={isEditMode}
      initialData={selectedSubCategory}
    />
  );
};

export default SubCategoryFormPage;