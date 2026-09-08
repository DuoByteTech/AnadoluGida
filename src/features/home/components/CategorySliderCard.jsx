import { Link } from "react-router-dom";

const CategorySliderCard = ({ title, slug }) => {
  const initial = title?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <Link to={`/shop/${slug}`} className="block">
      <div className="card w-20 border border-base-200 bg-base-100 transition hover:border-error/30 hover:shadow-sm sm:w-full">
        <div className="card-body flex items-center justify-center gap-2 p-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-lg font-bold text-error">
            {initial}
          </div>

          <span className="line-clamp-1 text-sm">{title}</span>
        </div>
      </div>
    </Link>
  );
};

export default CategorySliderCard;
