const Card = ({ children }) => {
  return (
    <div className="card card-border bg-base-100 shadow-sm border border-base-200/60 transition-all duration-300">
      {children}
    </div>
  );
};

export default Card; 
