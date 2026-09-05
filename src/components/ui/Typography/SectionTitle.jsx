const SectionTitle = ({ children, className = "" }) => (
  <h2 className={`text-2xl font-semibold mt-10 sm:mt-12 md:mt-14 lg:mt-15 ${className}`}>
    {children}
  </h2>
);

export default SectionTitle;
