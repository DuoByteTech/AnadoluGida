import { useEffect, useState } from "react";

import Slider from "./sections/Slider";
import CategorySlider from "./sections/CategorySlider";
import Promotions from "./sections/Promotions";
import PopularProducts from "./sections/PopularProducts";

import { getShopProducts } from "@/features/shop/services/product.service";

import { promotionsData } from "./data/promotionsData";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [productError, setProductError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);

        setProductError("");

        const data = await getShopProducts();

        if (!isMounted) {
          return;
        }

        setProducts(data);
      } catch (err) {
        console.error("Ana sayfa ürünleri yüklenirken hata oluştu:", err);

        if (isMounted) {
          setProductError("Produkte konnten nicht geladen werden.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Slider />

      <CategorySlider />

      <Promotions promotions={promotionsData} />

      {isLoadingProducts ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg" />

            <span className="text-sm text-base-content/60">
              Produkte werden geladen...
            </span>
          </div>
        </div>
      ) : productError ? (
        <div className="my-10">
          <div className="alert alert-error">
            <span>{productError}</span>
          </div>
        </div>
      ) : products.length > 0 ? (
        <PopularProducts products={products} />
      ) : (
        <div className="my-16 text-center text-sm text-base-content/60">
          Derzeit sind keine Produkte verfügbar.
        </div>
      )}
    </>
  );
};

export default HomePage;
