import PageHeader from "../PageHeader";

const BrandHeader = () => {
  return (
    <PageHeader
      title={"Markalar"}
      description={"Markaları buradan yönetebilirsiniz."}
      url={"brands/new"}
      linkText={"Marka Ekle"}
    />
  );
};

export default BrandHeader;
