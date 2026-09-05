import { useParams } from "react-router-dom";
import { brands } from "../data/brands";
import BrandForm from "../components/brandsPage/BrandForm";

const BrandFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const selectedBrand = isEditMode
    ? brands.find((item) => item.id === Number(id))
    : null;

  return (
    <BrandForm
      isEditMode={isEditMode}
      initialData={selectedBrand}
    />
  );
};

export default BrandFormPage;