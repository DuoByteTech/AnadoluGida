const CategorySliderCard = ({ image, title }) => {
  return (
    <div className="card border w-20 sm:w-full">
      <div className="card-body flex items-center justify-center text-center p-4">
        <img src={image} alt={title} className="w-12 h-12" />
        <span className="text-sm">{title}</span>
      </div>
    </div>
  );
};

export default CategorySliderCard;