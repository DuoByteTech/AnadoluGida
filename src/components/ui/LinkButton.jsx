import { Link } from "react-router-dom";

const LinkButton = ({ children, to, className = "", ...props }) => {
  return (
    <Link
      to={to}
      className={`btn rounded-xl border-brand-red-700 bg-brand-red-700 text-white hover:border-brand-red-800 hover:bg-brand-red-800 ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
