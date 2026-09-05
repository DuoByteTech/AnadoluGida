import Slider from "./sections/Slider";
import CategorySlider from "./sections/CategorySlider";
import Promotions from "./sections/Promotions";
import PopularProducts from "./sections/PopularProducts";

import { products } from "@/features/shop/data/products";
import { promotionsData } from "./data/promotionsData";

const HomePage = () => {
  return (
    <>
      <Slider />
      <CategorySlider />
      <Promotions promotions={promotionsData} />
      <PopularProducts products={products} />
    </>
  );
};

export default HomePage;