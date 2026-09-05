const Text = ({ children, muted = false, className = "" }) => (
  <p className={`text-base ${muted ? "text-base-content/60" : ""} ${className}`}>
    {children}
  </p>
);

export default Text;
