import Card from "@/components/ui/Card";
import { CardTitle } from "@/components/ui/Typography";
import RatingStars from "./RatingStars";
import ProductDetailsGrid from "./ProductDetailsGrid";

const ProductInfoPanel = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.price);

  // ✅ oldPrice formatla (varsa)
  const hasDiscount =
    typeof product.oldPrice === "number" && product.oldPrice > product.price;

  const formattedOldPrice = hasDiscount
    ? new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(product.oldPrice)
    : null;

  // ✅ (opsiyonel) indirim yüzdesi
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <Card>
      <div className="card-body space-y-4">
        {/* Başlık + etiket */}
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

        {/* Rating */}
        <div className="flex items-center gap-2">
          <RatingStars value={product.rating} name={`rating-${product.id}`} />
          <span className="text-sm opacity-70">{product.rating.toFixed(1)}</span>
        </div>

        {/* Fiyat */}
        <div className="rounded-2xl border border-base-200 p-4 flex items-end justify-between">
          <div className="space-y-1">
            {hasDiscount && (
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-60 line-through">
                  €{formattedOldPrice}
                </span>

                <span className="badge badge-ghost badge-sm border border-error/30 text-error">
                  -{discountPercent}%
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-semibold leading-none">
                €{formattedPrice}
              </span>
              <span className="text-xs md:text-sm opacity-50 leading-none">
                / Einheit
              </span>
            </div>
          </div>

          {/* Modern alternatif bilgi */}
          <span className="badge badge-outline badge-sm">
            Produktdetails
          </span>
        </div>

        <div className="divider my-0" />

        {/* Details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold opacity-80">Details</h3>
          <ProductDetailsGrid product={product} />
        </div>
      </div>
    </Card>
  );
};

export default ProductInfoPanel;