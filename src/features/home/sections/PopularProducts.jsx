import { Link } from "react-router-dom";

import { SectionTitle } from "@/components/ui/Typography";
import ProductCard from "@/features/shop/components/ProductCard";
import Divider from "@/components/ui/Divider";
import Button from "@/components/ui/Button";

const PopularProducts = ({ products }) => {
  return (
    <>
      <SectionTitle className="text-center">Beliebte Produkte</SectionTitle>
      <Divider />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
        {products.slice(0, 12).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-10 mb-20">
        <Link to="/shop">
          <Button className="btn btn-md px-8">Alle Produkte ansehen</Button>
        </Link>
      </div>
    </>
  );
};

export default PopularProducts;
