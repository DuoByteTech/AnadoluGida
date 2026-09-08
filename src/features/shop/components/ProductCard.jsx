import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { CardTitle } from "@/components/ui/Typography";
import { formatCategoryName } from "@/utils/formatters";

const ProductCard = ({ product }) => {
  const { image, category, name, price, badge, color, discountPercentage } =
    product;

  const badgeColorClass = {
    success: "badge-success",
    error: "badge-error",
    warning: "badge-warning",
    info: "badge-info",
    primary: "badge-primary",
    secondary: "badge-secondary",
    accent: "badge-accent",
    neutral: "badge-neutral",
  };

  const discount = Number(discountPercentage) || 0;

  const hasDiscount = discount > 0;

  const finalPrice = hasDiscount
    ? Number((price * (1 - discount / 100)).toFixed(2))
    : Number(price);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(finalPrice);

  return (
    <>
      <Card>
        <div className="m-4">
          {badge && (
            <div
              className={`badge badge-sm text-white m-3 absolute top-0 left-0 
                ${badgeColorClass[color] ?? "badge-neutral"}`}
            >
              {badge}
            </div>
          )}
        </div>

        <figure className="px-6 pt-6">
          <Link to={`/product/${product.slug}`}>
            <img
              width={150}
              src={image}
              alt={name}
              className="h-36 w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
            />
          </Link>
        </figure>

        <div className="card-body pt-4">
          <span className="text-xs tracking-wide uppercase opacity-60">
            {formatCategoryName(category)}
          </span>

          <CardTitle className="-mt-2 line-clamp-2 leading-snug cursor-pointer">
            <Link to={`/product/${product.slug}`}>{name}</Link>
          </CardTitle>

          <div className="flex justify-between items-center mt-1">
            <div className="flex items-end gap-2">
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold -mb-1">
                    €{formattedPrice}
                  </span>

                  {hasDiscount && (
                    <span className="badge badge-ghost badge-xs border border-error/30 text-error">
                      -{discount}%
                    </span>
                  )}
                </div>

                <div className="text-xs opacity-50 mt-1">/ Einheit</div>
              </div>
            </div>

            <button
              className="btn btn-circle btn-error btn-sm shadow-sm hover:shadow-md transition-all duration-300"
              aria-label="Add to cart"
              type="button"
            >
              <ShoppingBagIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ProductCard;
