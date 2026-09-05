import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import GradientOverlay from "@/components/ui/GradientOverlay";
import OverlayCard from "@/components/ui/OverlayCard";

const PromotionsCard = ({ image, title, description }) => {
  return (
    <OverlayCard
      image={image}
      alt={title}
      className="
      h-44 xs:h-48 sm:h-52 md:h-60 lg:h-64 xl:h-72
      rounded-2xl overflow-hidden 
    "
    >
      <GradientOverlay />

      <div className="absolute inset-0 flex flex-col justify-center items-start text-white p-6 gap-6">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">
            {title}
          </h2>

          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base opacity-90 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="mt-3 sm:mt-4">
          <Link to="/shop?discount=true">
            <Button className="btn btn-sm sm:btn-md btn-neutral">
              Jetzt entdecken
            </Button>
          </Link>
        </div>
      </div>
    </OverlayCard>
  );
};

export default PromotionsCard;