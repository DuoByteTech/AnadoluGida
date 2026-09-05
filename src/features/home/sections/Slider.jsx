import { Navigation, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import kasap from "@/assets/kasap.webp";
import manav from "@/assets/manav.webp";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CarouselSection = () => {
  return (
    <Swiper
      className="hero-swiper"
      modules={[Navigation, Pagination, A11y]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log("slide change")}
    >
      <SwiperSlide>
        <div className="w-full aspect-[16/6] sm:aspect-[16/7] md:aspect-[16/5] lg:aspect-[16/5]">
          <img
            src={kasap}
            alt="Kasap"
            className="w-full h-full rounded-md object-cover object-top"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="w-full aspect-[16/6] sm:aspect-[16/7] md:aspect-[16/5] lg:aspect-[16/5]">
          <img
            src={manav}
            alt="Manav"
            className="w-full h-full rounded-md object-cover object-top"
          />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default CarouselSection;