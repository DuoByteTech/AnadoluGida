const Divider = ({ className = "" }) => {
  return (
    <div
      className={` mx-auto my-4 sm:my-5 md:my-6 w-3/4 sm:w-full max-w-xs sm:max-w-sm md:max-w-md border-t border-black/60
        ${className}
      `}
    />
  );
};

export default Divider;