import PageHeader from "../PageHeader";

const ProductHeader = () => {
  return (
    <PageHeader
      title={"Ürünler"}
      description={"Ürünleri buradan yönetebilirsiniz."}
      url={"products/new"}
      linkText={"Ürün Ekle"}
    />
  )
};

export default ProductHeader;
