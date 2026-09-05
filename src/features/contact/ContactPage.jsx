const ContactPage = () => {
  return (
    <section className="container mx-auto pt-2 sm:pt-3 md:pt-4 lg:pt-6 pb-16">

      {/* Title */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          Standort
        </h1>

        <p className="mt-3 text-base-content/70">
          Besuchen Sie uns in Kiel – wir freuen uns auf Sie.
        </p>
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden shadow-md">

        {/* Google Map */}
        <iframe
          src="https://www.google.com/maps?q=Anadolu+Gida,+Kaiserstraße+68,+24143+Kiel,+Deutschland&output=embed"
          width="100%"
          height="500"
          style={{ border: 0 }}
          loading="lazy"
        />

        {/* Info Card */}
        <div className="absolute bottom-6 left-6 max-w-xs bg-base-100 shadow-xl rounded-xl p-5 space-y-2">

          <h3 className="font-semibold text-lg">
            Anadolu Gıda
          </h3>

          <p className="text-sm opacity-70">
            Kaiserstraße 68 <br />
            24143 Kiel <br />
            Deutschland
          </p>

          <p className="text-sm">
            📞 +49 173 2461008
          </p>

          <a
            href="https://www.google.com/maps?q=Anadolu+Gida,+Kaiserstraße+68,+24143+Kiel,+Deutschland"
            target="_blank"
            className="btn btn-error btn-sm mt-2"
          >
            Route öffnen
          </a>

        </div>

      </div>

    </section>
  );
};

export default ContactPage;