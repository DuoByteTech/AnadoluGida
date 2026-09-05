import PageHeader from "../PageHeader";

const SubCategoryHeader = () => {
  return (
    <PageHeader
      title={"Alt Kategoriler"}
      description={" Alt kategorilerini buradan yönetebilirsiniz."}
      url={"subCategories/new"}
      linkText={"Alt Kategori Ekle"}
    />
  )
};

export default SubCategoryHeader;
