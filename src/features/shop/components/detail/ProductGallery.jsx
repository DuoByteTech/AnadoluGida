import Card from "@/components/ui/Card";

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

const ProductGallery = ({
  product,
  images = [],
  activeIndex = 0,
  onChangeIndex,
}) => {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  const hasImages = safeImages.length > 0;

  const safeIndex = hasImages
    ? Math.min(Math.max(activeIndex, 0), safeImages.length - 1)
    : 0;

  const activeImage = hasImages ? safeImages[safeIndex] : null;

  const handleChangeIndex = (index) => {
    if (!onChangeIndex) {
      return;
    }

    onChangeIndex(index);
  };

  return (
    <>
      <Card>
        <div className="card-body">
          <figure className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-2xl bg-base-100 sm:min-h-80 md:min-h-96 lg:min-h-100">
            {product.badge && (
              <div
                className={[
                  "badge badge-sm absolute left-0 top-0 z-10 m-3 text-white",
                  badgeColorClass[product.color] ?? "badge-neutral",
                ].join(" ")}
              >
                {product.badge}
              </div>
            )}

            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="h-72 w-full cursor-zoom-in object-contain sm:h-80 md:h-96 lg:h-100"
              />
            ) : (
              <div className="flex h-72 w-full flex-col items-center justify-center gap-2 text-center text-base-content/40 sm:h-80 md:h-96 lg:h-100">
                <span className="text-lg font-medium">Kein Produktbild</span>

                <span className="text-sm">
                  Für dieses Produkt ist noch kein Bild vorhanden.
                </span>
              </div>
            )}

            {safeImages.length > 1 && (
              <div className="badge badge-neutral absolute bottom-3 right-3">
                {safeIndex + 1} / {safeImages.length}
              </div>
            )}
          </figure>
        </div>
      </Card>

      {safeImages.length > 0 && (
        <div className="mt-6 mb-8 flex gap-3 overflow-x-auto pb-2">
          {safeImages.map((src, index) => {
            const isActive = index === safeIndex;

            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => handleChangeIndex(index)}
                className={[
                  "shrink-0 rounded-2xl border p-2 transition",
                  "cursor-pointer text-base-content",
                  isActive
                    ? "border-error bg-error/10"
                    : "border-base-300 bg-base-100 hover:border-error/40 hover:bg-error/5",
                ].join(" ")}
                aria-label={`Produktbild ${index + 1} anzeigen`}
                aria-pressed={isActive}
              >
                <img
                  src={src}
                  alt={`${product.name} ${index + 1}`}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ProductGallery;
