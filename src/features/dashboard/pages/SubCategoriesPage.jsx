import { useState } from "react";
import SubCategoryHeader from "../components/subCategoriesPage/SubCategoryHeader";
import SubCategoryTable from "../components/subCategoriesPage/SubCategoryTable";
import { subcategories as initialSubcategories } from "../data/subcategories";

const SubCategoriesPage = () => {
  const [subcategories, setSubcategories] = useState(initialSubcategories);

  const handleDelete = (id) => {
    setSubcategories((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <SubCategoryHeader />
      <SubCategoryTable
        subcategories={subcategories}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SubCategoriesPage;