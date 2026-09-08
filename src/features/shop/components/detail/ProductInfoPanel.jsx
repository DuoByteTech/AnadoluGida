import Card from "@/components/ui/Card";
import { CardTitle } from "@/components/ui/Typography";
import RatingStars from "./RatingStars";
import ProductDetailsGrid from "./ProductDetailsGrid";

const ProductInfoPanel = ({ product }) => {
  const discount = Number(product.discountPercentage) || 0;

  const hasDiscount = discount > 0;

  const finalPrice = hasDiscount
    ? Number((product.price * (1 - discount / 100)).toFixed(2))
    : Number(product.price);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(finalPrice);

  return (
    <Card>
      <div className="card-body space-y-4">
        <div className="space-y-2">
          <CardTitle className="text-xl md:text-2xl font-semibold leading-tight tracking-tight">
            {product.name}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] md:text-xs tracking-widest uppercase opacity-60">
              {product.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RatingStars value={product.rating} name={`rating-${product.id}`} />

          <span className="text-sm opacity-70">
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div className="rounded-2xl border border-base-200 p-4 flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-semibold leading-none">
                €{formattedPrice}
              </span>

              {hasDiscount && (
                <span className="badge badge-ghost badge-sm border border-error/30 text-error">
                  -{discount}%
                </span>
              )}
            </div>

            <span className="text-xs md:text-sm opacity-50 leading-none">
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
