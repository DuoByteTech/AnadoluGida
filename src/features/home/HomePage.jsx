import { useEffect, useState } from "react";

import Slider from "./sections/Slider";
import CategorySlider from "./sections/CategorySlider";
import Promotions from "./sections/Promotions";
import PopularProducts from "./sections/PopularProducts";

import { getShopProducts } from "@/features/shop/services/product.service";

import { getActivePromotions } from "./services/promotion.service";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  const [promotions, setPromotions] = useState([]);

  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);

  const [productError, setProductError] = useState("");

  const [promotionError, setPromotionError] = useState("");

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

    const loadPromotions = async () => {
      try {
        setIsLoadingPromotions(true);

        setPromotionError("");

        const data = await getActivePromotions();

        if (!isMounted) {
          return;
        }

        setPromotions(data);
      } catch (err) {
        console.error("Promosyonlar yüklenirken hata oluştu:", err);

        if (isMounted) {
          setPromotionError("Aktionen konnten nicht geladen werden.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingPromotions(false);
        }
      }
    };

    loadProducts();

    loadPromotions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Slider />

      <CategorySlider />

      {isLoadingPromotions ? (
        <div className="my-12 flex min-h-[180px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg" />

            <span className="text-sm text-base-content/60">
              Aktionen werden geladen...
            </span>
          </div>
        </div>
      ) : promotionError ? (
        <div className="my-10">
          <div className="alert alert-error">
            <span>{promotionError}</span>
          </div>
        </div>
      ) : promotions.length > 0 ? (
        <Promotions promotions={promotions} />
      ) : null}

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
