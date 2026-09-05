const RatingStars = ({ value = 0, name = "rating" }) => {
  return (
    <div className="rating rating-xs rating-half -ml-2 pointer-events-none">
      <input type="radio" name={name} className="rating-hidden" readOnly />

      {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((v) => (
        <input
          key={v}
          type="radio"
          name={name}
          className={[
            "mask mask-star",
            v % 1 === 0 ? "mask-half-2" : "mask-half-1",
            "bg-error",
          ].join(" ")}
          aria-label={`${v} star`}
          checked={value >= v}
          readOnly
        />
      ))}
    </div>
  );
};

export default RatingStars;