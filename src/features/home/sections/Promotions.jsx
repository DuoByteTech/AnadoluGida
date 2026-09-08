import PromotionsCard from "../components/PromotionsCard";

const Promotions = ({ promotions = [] }) => {
  if (!promotions.length) {
    return null;
  }

  return (
    <section className="mt-12 sm:mt-16 lg:mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {promotions.map((promotion) => (
          <PromotionsCard
            key={promotion.id}
            image={promotion.image}
            title={promotion.title}
            description={promotion.description}
            linkUrl={promotion.linkUrl}
            discountPercentage={promotion.discountPercentage}
          />
        ))}
      </div>
    </section>
  );
};

export default Promotions;
