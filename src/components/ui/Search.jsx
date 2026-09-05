import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Search = ({
  value = "",
  onChange,
  placeholder = "Produkte suchen...",
  className = "",
  inputClassName = "",
}) => {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <MagnifyingGlassIcon
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-5 w-5 text-base-content/40 pointer-events-none"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={[
          "input input-bordered w-full rounded-full",
          "pl-12 pr-4",
          inputClassName,
        ].join(" ")}
      />
    </div>
  );
};

export default Search;