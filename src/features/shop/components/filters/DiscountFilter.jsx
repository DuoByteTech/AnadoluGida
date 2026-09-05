const DiscountFilter = ({ onlyDiscounted, toggleOnlyDiscounted }) => {
  return (
    <div className="px-4 pb-4">
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          className="checkbox checkbox-sm checkbox-error"
          checked={onlyDiscounted}
          onChange={toggleOnlyDiscounted}
        />
        <span className="text-sm font-medium">Only discounted</span>
      </label>
    </div>
  );
};

export default DiscountFilter;