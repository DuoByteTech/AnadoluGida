import Card from "@/components/ui/Card";

import { CardTitle } from "@/components/ui/Typography";

import RatingStars from "./RatingStars";
import ProductDetailsGrid from "./ProductDetailsGrid";

const ProductInfoPanel = ({ product }) => {
  const price = Number(product.price) || 0;

  const discount = Number(product.discountPercentage) || 0;

  const hasDiscount = discount > 0;

  const finalPrice = hasDiscount
    ? Number((price * (1 - discount / 100)).toFixed(2))
    : price;

  const formattedPrice = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(finalPrice);

  const formattedOriginalPrice = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  const rating = Number.isFinite(Number(product.rating))
    ? Number(product.rating)
    : null;

  return (
    <Card>
      <div className="card-body space-y-4">
        <div className="space-y-2">
          <CardTitle className="text-xl font-semibold leading-tight tracking-tight md:text-2xl">
            {product.name}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            {product.category && (
              <span className="text-[11px] uppercase tracking-widest opacity-60 md:text-xs">
                {product.category}
              </span>
            )}

            {product.brand && (
              <>
                <span className="opacity-30">•</span>

                <span className="text-[11px] uppercase tracking-widest opacity-60 md:text-xs">
                  {product.brand}
                </span>
              </>
            )}
          </div>
        </div>

        {rating !== null && (
          <div className="flex items-center gap-2">
            <RatingStars value={rating} name={`rating-${product.id}`} />

            <span className="text-sm opacity-70">{rating.toFixed(1)}</span>
          </div>
        )}

        <div className="flex items-end justify-between rounded-2xl border border-base-200 p-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl font-semibold leading-none md:text-3xl">
                €{formattedPrice}
              </span>

              {hasDiscount && (
                <span className="badge badge-error badge-sm text-white">
                  -{discount}%
                </span>
              )}
            </div>

            {hasDiscount && (
              <div className="text-sm text-base-content/50 line-through">
                €{formattedOriginalPrice}
              </div>
            )}

            <span className="block text-xs leading-none opacity-50 md:text-sm">
              / Einheit
            </span>
          </div>

          <span className="badge badge-outline badge-sm">Produktdetails</span>
        </div>

        <div className="divider my-0" />

        <div className="space-y-2">
          <h3 className="text-sm font-semibold opacity-80">Details</h3>

          <ProductDetailsGrid product={product} />
        </div>
      </div>
    </Card>
  );
};

export default ProductInfoPanel;
