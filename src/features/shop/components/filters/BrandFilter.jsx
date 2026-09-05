const BrandFilter = ({ brands, selectedBrands, toggleBrand }) => {
  return (
    <div className="px-4 pb-4 space-y-2">
      {brands.map((b) => (
        <label key={b.id} className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-sm checkbox-error mr-2"
            checked={selectedBrands.includes(b.slug)}
            onChange={() => toggleBrand(b.slug)}
          />
          <span className="text-sm">{b.name}</span>
        </label>
      ))}
    </div>
  );
};

export default BrandFilter;