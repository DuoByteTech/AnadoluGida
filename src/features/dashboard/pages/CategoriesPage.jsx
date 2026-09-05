import { useState } from "react";

import { categories as initialCategories } from "../data/categories";
import CategoryHeader from "../components/categoriesPage/CategoryHeader";
import CategoryTable from "../components/categoriesPage/CategoryTable";

const CategoriesPage = () => {
  const [categories, setCategories] = useState(initialCategories);

  const handleDeleteCategory = (id) => {
    const filteredCategories = categories.filter((item) => item.id !== id);
    setCategories(filteredCategories);
  };

  return (
    <div className="space-y-6">
      <CategoryHeader />
      <CategoryTable
        categories={categories}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
};

export default CategoriesPage;