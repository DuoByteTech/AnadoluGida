import { useEffect, useState } from "react";

import { A11y, Pagination } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import CategorySliderCard from "../components/CategorySliderCard";

import { SectionTitle } from "@/components/ui/Typography";

import Divider from "@/components/ui/Divider";

import { getShopCategories } from "@/features/shop/services/filter.service";

import "swiper/css";
import "swiper/css/pagination";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getShopCategories();

        if (!isMounted) {
          return;
        }

        setCategories(data);
      } catch (err) {
        console.error("Ana sayfa kategorileri yüklenirken hata oluştu:", err);

        if (isMounted) {
          setError("Kategorien konnten nicht geladen werden.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <>
        <SectionTitle className="text-center">
          Ausgewählte Kategorien
        </SectionTitle>

        <Divider />

        <div className="flex min-h-32 items-center justify-center">
          <span className="loading loading-spinner loading-md" />
        </div>
      </>
    );
  }

  if (error || categories.length === 0) {
    return null;
  }

  const shouldLoop = categories.length > 8;

  return (
    <>
      <SectionTitle className="text-center">
        Ausgewählte Kategorien
      </SectionTitle>

      <Divider />

      <div className="relative">
        <Swiper
          modules={[A11y, Pagination]}
          spaceBetween={10}
          pagination={{
            clickable: true,
            el: ".category-pagination",
          }}
          className="pb-6"
          breakpoints={{
            320: {
              slidesPerView: 4.5,
              spaceBetween: 6,
            },

            420: {
              slidesPerView: 5,
              spaceBetween: 10,
            },

            640: {
              slidesPerView: 6,
              spaceBetween: 12,
            },

            768: {
              slidesPerView: 7,
              spaceBetween: 12,
            },

            1024: {
              slidesPerView: 8,
              spaceBetween: 14,
            },
          }}
          loop={shouldLoop}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <CategorySliderCard title={category.name} slug={category.slug} />
            </SwiperSlide>
          ))}
        </Swiper>

        {categories.length > 1 && (
          <div className="category-pagination mt-6 flex justify-center" />
        )}
      </div>
    </>
  );
};

export default CategorySlider;
