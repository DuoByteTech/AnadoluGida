const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`btn bg-brand-red-700 text-white border-brand-red-700 hover:bg-brand-red-800 hover:border-brand-red-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
