const AboutSection = ({ content }) => {
  if (!content) return null;

  const { image, title, paragraphs } = content;

  return (
    <section className="container mx-auto pt-2 sm:pt-3 md:pt-4 lg:pt-6 pb-16">

      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* Image */}
        <div className="w-full">
          <img
            src={image?.src}
            alt={image?.alt}
            className="w-full rounded-xl object-cover aspect-[16/10]"
          />
        </div>

        {/* Text */}
        <div className="space-y-6">

          <h1 className="text-3xl md:text-4xl font-bold">
            {title}
          </h1>

          {paragraphs.map((p, i) => (
            <p key={i} className="text-base-content/70 leading-relaxed">
              {p}
            </p>
          ))}

        </div>

      </div>

    </section>
  );
};

export default AboutSection;