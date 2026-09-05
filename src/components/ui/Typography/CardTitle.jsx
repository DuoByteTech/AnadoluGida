const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-medium ${className}`}>
    {children}
  </h3>
);

export default CardTitle;
