import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { products } from "./data/products";

import Divider from "@/components/ui/Divider";
import { SectionTitle } from "@/components/ui/Typography";

import ProductGallery from "./components/detail/ProductGallery";
import ProductInfoPanel from "./components/detail/ProductInfoPanel";
import RelatedProductsGrid from "./components/detail/RelatedProductsGrid";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const ProductDetailPage = () => {
  const { slug } = useParams();

  const product = useMemo(() => products.find((p) => p.slug === slug), [slug]);

  const images = useMemo(() => {
    const arr = Array.isArray(product?.images) ? product.images : [];
    return (arr.length ? arr : [product?.image]).filter(Boolean);
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);

  if (!product) return <div className="p-6">Produkt nicht gefunden</div>;

  return (
    <>
      <Breadcrumbs />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ProductGallery
            product={product}
            images={images}
            activeIndex={activeIndex}
            onChangeIndex={setActiveIndex}
          />
        </div>

        <div className="lg:col-span-3">
          <ProductInfoPanel product={product} />
        </div>
      </div>

      <SectionTitle className="text-center">Beliebte Produkte</SectionTitle>
      <Divider />

      <RelatedProductsGrid products={products.slice(0, 6)} />
    </>
  );
};

export default ProductDetailPage;