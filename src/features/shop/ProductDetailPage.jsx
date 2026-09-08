import { useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import Divider from "@/components/ui/Divider";

import { SectionTitle } from "@/components/ui/Typography";

import Breadcrumbs from "@/components/ui/Breadcrumbs";

import ProductGallery from "./components/detail/ProductGallery";
import ProductInfoPanel from "./components/detail/ProductInfoPanel";
import RelatedProductsGrid from "./components/detail/RelatedProductsGrid";

import {
  getRelatedProducts,
  getShopProductBySlug,
} from "./services/product.service";

const ProductDetailPage = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        setActiveIndex(0);

        const productData = await getShopProductBySlug(slug);

        if (!isMounted) {
          return;
        }

        if (!productData) {
          setProduct(null);
          setRelatedProducts([]);

          return;
        }

        setProduct(productData);

        try {
          const relatedData = await getRelatedProducts({
            productId: productData.id,

            categoryId: productData.categoryId,

            limit: 6,
          });

          if (isMounted) {
            setRelatedProducts(relatedData);
          }
        } catch (relatedError) {
          console.error(
            "Benzer ürünler yüklenirken hata oluştu:",
            relatedError,
          );

          if (isMounted) {
            setRelatedProducts([]);
          }
        }
      } catch (err) {
        console.error("Ürün detayları yüklenirken hata oluştu:", err);

        if (isMounted) {
          setError("Produktinformationen konnten nicht geladen werden.");

          setProduct(null);
          setRelatedProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const images = useMemo(() => {
    if (!product) {
      return [];
    }

    if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
      return product.imageUrls;
    }

    if (product.image) {
      return [product.image];
    }

    return [];
  }, [product]);

  useEffect(() => {
    if (activeIndex >= images.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, images.length]);

  if (isLoading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg" />

          <span className="text-sm text-base-content/60">
            Produkt wird geladen...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold">Produkt nicht gefunden</h1>

          <p className="text-base-content/60">
            Das gesuchte Produkt existiert nicht oder ist derzeit nicht
            verfügbar.
          </p>

          <Link to="/shop" className="btn btn-primary rounded-xl">
            Zurück zum Shop
          </Link>
        </div>
      </div>
    );
  }

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

      {relatedProducts.length > 0 && (
        <>
          <SectionTitle className="text-center">Beliebte Produkte</SectionTitle>

          <Divider />

          <RelatedProductsGrid products={relatedProducts} />
        </>
      )}
    </>
  );
};

export default ProductDetailPage;
