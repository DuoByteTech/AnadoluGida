import PromotionsCard from "../components/PromotionsCard";

const Promotions = ({ promotions }) => {
  return (
    <section className="mt-12 sm:mt-16 lg:mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {promotions.map((promo) => (
          <PromotionsCard
            key={promo.id}
            image={promo.image}
            title={promo.title}
            description={promo.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Promotions;