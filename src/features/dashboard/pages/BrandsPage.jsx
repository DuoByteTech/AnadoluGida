import { useState } from "react";
import { brands as initialBrands } from "../data/brands";
import BrandHeader from "../components/brandsPage/BrandHeader";
import BrandTable from "../components/brandsPage/BrandTable";

const BrandsPage = () => {
  const [brands, setBrands] = useState(initialBrands);

  const handleDeleteBrand = (id) => {
    setBrands((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <BrandHeader />
      <BrandTable
        brands={brands}
        onDelete={handleDeleteBrand}
      />
    </div>
  );
};

export default BrandsPage;