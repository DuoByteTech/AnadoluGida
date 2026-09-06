import PageHeader from "../PageHeader";

const CategoryHeader = () => {
  return (
    <PageHeader
      title={"Kategoriler"}
      description={"Kategorilerini buradan yönetebilirsiniz. "}
      url={"categories/new"}
      linkText={"Kategori Ekle"}
    />
  );
};

export default CategoryHeader;
