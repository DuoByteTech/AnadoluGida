import { Link } from "react-router-dom";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";

import Card from "@/components/ui/Card";

import { CardTitle } from "@/components/ui/Typography";

import { formatCategoryName } from "@/utils/formatters";

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

const ProductCard = ({ product }) => {
  const {
    image,
    category,
    name,
    price,
    badge,
    color,
    discountPercentage,
    slug,
  } = product;

  const basePrice = Number(price) || 0;

  const discount = Number(discountPercentage) || 0;

  const hasDiscount = discount > 0;

  const finalPrice = hasDiscount
    ? Number((basePrice * (1 - discount / 100)).toFixed(2))
    : basePrice;

  const formattedPrice = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(finalPrice);

  const formattedBasePrice = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(basePrice);

  const productUrl = `/product/${slug}`;

  return (
    <Card className="relative h-full overflow-hidden">
      {badge && (
        <div
          className={[
            "badge badge-sm absolute left-3 top-3 z-10 text-white",
            badgeColorClass[color] ?? "badge-neutral",
          ].join(" ")}
        >
          {badge}
        </div>
      )}

      {hasDiscount && !badge && (
        <div className="badge badge-error badge-sm absolute left-3 top-3 z-10 text-white">
          -{discount}%
        </div>
      )}

      <figure className="px-6 pt-6">
        <Link
          to={productUrl}
          className="flex h-36 w-full items-center justify-center"
        >
          {image ? (
            <img
              width={150}
              src={image}
              alt={name}
              loading="lazy"
              className="h-36 w-full cursor-pointer object-contain drop-shadow-sm transition-transform duration-300 hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-36 w-full items-center justify-center rounded-xl bg-base-200 text-center text-xs text-base-content/40">
              Kein Produktbild
            </div>
          )}
        </Link>
      </figure>

      <div className="card-body pt-4">
        <span className="text-xs uppercase tracking-wide opacity-60">
          {category ? formatCategoryName(category) : "Produkt"}
        </span>

        <CardTitle className="-mt-2 line-clamp-2 cursor-pointer leading-snug">
          <Link to={productUrl}>{name}</Link>
        </CardTitle>

        <div className="mt-1 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-semibold leading-tight">
                €{formattedPrice}
              </span>

              {hasDiscount && (
                <span className="badge badge-error badge-xs text-white">
                  -{discount}%
                </span>
              )}
            </div>

            {hasDiscount && (
              <div className="mt-1 text-xs text-base-content/40 line-through">
                €{formattedBasePrice}
              </div>
            )}

            <div className="mt-1 text-xs opacity-50">/ Einheit</div>
          </div>

          <button
            className="btn btn-circle btn-error btn-sm shrink-0 shadow-sm transition-all duration-300 hover:shadow-md"
            aria-label={`${name} zum Warenkorb hinzufügen`}
            type="button"
          >
            <ShoppingBagIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
