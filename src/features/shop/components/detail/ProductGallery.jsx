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

const ProductGallery = ({ product, images, activeIndex, onChangeIndex }) => {
  const safeIndex = Math.min(activeIndex, Math.max(0, images.length - 1));
  const activeImage = images[safeIndex];

  return (
    <>
      {/* Ana görsel */}
      <Card>
        <div className="card-body">
          <figure className="relative">
            {product.badge && (
              <div
                className={[
                  "badge badge-sm text-white m-3 absolute top-0 left-0 z-10",
                  badgeColorClass[product.color] ?? "badge-neutral",
                ].join(" ")}
              >
                {product.badge}
              </div>
            )}

            <img
              src={activeImage}
              alt={product.name}
              className="w-full object-contain cursor-zoom-in h-72 sm:h-80 md:h-96 lg:h-100"
              loading="lazy"
            />
          </figure>
        </div>
      </Card>

      {/* Thumbnail strip */}
      <div className="flex gap-3 overflow-x-auto pb-1 mt-4">
        {images.map((src, i) => {
          const isActive = i === safeIndex;

          return (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => onChangeIndex(i)}
              className={[
                "shrink-0 rounded-2xl p-2 border transition",
                "text-base-content cursor-pointer hover:bg-error/10",
                "border border-error/40",
                isActive ? "bg-error/10" : "bg-base-100",
              ].join(" ")}
              aria-label={`Select image ${i + 1}`}
            >
              <img
                src={src}
                alt={`${product.name} ${i + 1}`}
                className="h-16 w-16 rounded-xl object-cover"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ProductGallery;
