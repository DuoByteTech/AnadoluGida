import { NavLink, useParams } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

import { products } from "@/features/shop/data/products";

const Breadcrumbs = () => {
  const { slug } = useParams();

  const product = products.find((p) => p.slug === slug);

  const isShopPage = !slug;

  return (
    <nav className="flex items-center text-sm mb-4 text-base-content/70">

      {/* Startseite */}
      <NavLink
        to="/"
        className="hover:text-base-content transition"
      >
        Startseite
      </NavLink>

      <ChevronRightIcon className="w-4 h-4 mx-2 opacity-50" />

      {/* Shop */}
      {isShopPage ? (
        <span className="font-medium text-base-content">Shop</span>
      ) : (
        <NavLink
          to="/shop"
          className="hover:text-base-content transition"
        >
          Shop
        </NavLink>
      )}

      {/* Product */}
      {product && (
        <>
          <ChevronRightIcon className="w-4 h-4 mx-2 opacity-50" />
          <span className="font-medium text-base-content">
            {product.name}
          </span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumbs;