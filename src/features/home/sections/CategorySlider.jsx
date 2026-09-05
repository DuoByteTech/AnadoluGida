import { A11y, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import CategorySliderCard from "../components/CategorySliderCard";
import { SectionTitle } from "@/components/ui/Typography";
import categories from "../data/categories";
import Divider from "@/components/ui/Divider";

import "swiper/css";
import "swiper/css/pagination";

const CategorySlider = () => {
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
            el: ".category-pagination", // 👈 buraya bas
          }}
          className="pb-6" // çok şişirmeye gerek yok
          breakpoints={{
            320: { slidesPerView: 4.5, spaceBetween: 6 },
            420: { slidesPerView: 5, spaceBetween: 10 },
            640: { slidesPerView: 6, spaceBetween: 12 },
            768: { slidesPerView: 7, spaceBetween: 12 },
            1024: { slidesPerView: 8, spaceBetween: 14 },
          }}
          loop
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <CategorySliderCard image={category.image} title={category.title} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 👇 Pagination artık burada, istediğin kadar aşağı al */}
        <div className="category-pagination mt-6 flex justify-center" />
      </div>
    </>
  );
};

export default CategorySlider;
