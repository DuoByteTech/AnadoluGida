import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import navItems from "./constants/navItems";

const NAV_COMPANY = ["Über uns", "Kontakt"];

const Footer = () => {
  return (
    <footer className="w-full">
      {/* üst: koyu kırmızı + gradient + border */}
      <div className="bg-gradient-to-b from-error to-error/90 text-error-content">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-12">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                Anadolu Gıda
              </h3>
              <p className="mt-3 text-sm text-error-content/80 leading-relaxed">
                Taze ve güvenilir gıda ürünleri.
              </p>

              {/* küçük accent çizgi */}
              <div className="mt-5 h-[2px] w-10 rounded-full bg-error-content/70" />
            </div>

            {/* Shop */}
            <div>
              <h6 className="text-xs font-semibold tracking-[0.18em] uppercase text-error-content/80">
                Shop
              </h6>
              <div className="mt-4 flex flex-col gap-2">
                {navItems
                  .filter((item) => item.url !== "/about" && item.url !== "/contact")
                  .map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.url}
                      className="w-fit text-sm text-error-content/80 hover:text-error-content transition"
                    >
                      <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-error-content/70 after:w-0 after:transition-all after:duration-300 hover:after:w-full">
                        {item.name}
                      </span>
                    </NavLink>
                  ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <h6 className="text-xs font-semibold tracking-[0.18em] uppercase text-error-content/80">
                Company
              </h6>
              <div className="mt-4 flex flex-col gap-2">
                {navItems
                  .filter((item) => item.url !== "/" && item.url !== "/angebote" && item.url !== "/shop")
                  .map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.url}
                      className="w-fit text-sm text-error-content/80 hover:text-error-content transition"
                    >
                      <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-error-content/70 after:w-0 after:transition-all after:duration-300 hover:after:w-full">
                        {item.name}
                      </span>
                    </NavLink>
                  ))}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h6 className="text-xs font-semibold tracking-[0.18em] uppercase text-error-content/80">
                Social Media
              </h6>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href="#"
                  className="group flex items-center justify-center w-11 h-11 rounded-full
                             border border-error-content/25
                             bg-error/30 backdrop-blur
                             hover:bg-error/40 hover:border-error-content/40
                             transition-all duration-200 hover:-translate-y-0.5"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-4 h-4 text-error-content/90 group-hover:text-error-content transition" />
                </a>

                <a
                  href="#"
                  className="group flex items-center justify-center w-11 h-11 rounded-full
                             border border-error-content/25
                             bg-error/30 backdrop-blur
                             hover:bg-error/40 hover:border-error-content/40
                             transition-all duration-200 hover:-translate-y-0.5"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-4 h-4 text-error-content/90 group-hover:text-error-content transition" />
                </a>
              </div>
            </div>
          </div>

          {/* divider */}
          <div className="h-px w-full bg-error-content/15" />

          {/* alt bar: daha koyu + küçük yazı */}
          <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-error-content/80">
            <p>
              © {new Date().getFullYear()} Anadolu Gıda — All rights reserved
            </p>
            <p className="text-error-content/60">
              Built with ♥ in Vite + DaisyUI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;