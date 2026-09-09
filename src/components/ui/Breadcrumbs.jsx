import { NavLink } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const Breadcrumbs = ({ productName = "" }) => {
  return (
    <nav className="mb-4 flex items-center text-sm text-base-content/70">
      <NavLink to="/" className="transition hover:text-base-content">
        Startseite
      </NavLink>

      <ChevronRightIcon className="mx-2 h-4 w-4 opacity-50" />

      {productName ? (
        <NavLink to="/shop" className="transition hover:text-base-content">
          Shop
        </NavLink>
      ) : (
        <span className="font-medium text-base-content">Shop</span>
      )}

      {productName && (
        <>
          <ChevronRightIcon className="mx-2 h-4 w-4 opacity-50" />

          <span className="font-medium text-base-content">{productName}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumbs;
