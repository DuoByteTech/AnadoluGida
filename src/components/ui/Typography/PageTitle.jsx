const PageTitle = ({ children, className = "" }) => (
  <h1 className={`text-4xl font-bold leading-tight ${className}`}>
    {children}
  </h1>
);

export default PageTitle;
