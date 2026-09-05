const ProductDetailsGrid = ({ product }) => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <div className="opacity-60">Marke</div>
      <div className="font-medium">{product.brand}</div>

      <div className="opacity-60">Unterkategorie</div>
      <div className="font-medium">{product.subcategory}</div>

      {product.unit && (
        <>
          <div className="opacity-60">Einheit</div>
          <div className="font-medium">
            {product.unitAmount ? `${product.unitAmount} ` : ""}
            {product.unit}
          </div>
        </>
      )}

      {product.origin && (
        <>
          <div className="opacity-60">Herkunft</div>
          <div className="font-medium">{product.origin}</div>
        </>
      )}

      {product.availability && (
        <>
          <div className="opacity-60">Verfügbarkeit</div>
          <div className="font-medium">{product.availability}</div>
        </>
      )}
    </div>
  );
};

export default ProductDetailsGrid;