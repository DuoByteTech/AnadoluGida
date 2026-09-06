import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import navItems from "./constants/navItems";

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="bg-gradient-to-b from-brand-green-600 to-brand-green-700 text-brand-cream-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-brand-cream-100">
                Anadolu Gıda
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-brand-cream-400">
                Taze ve güvenilir gıda ürünleri.
              </p>

              <div className="mt-5 h-[2px] w-10 rounded-full bg-brand-red-500" />
            </div>

            {/* Shop */}
            <div>
              <h6 className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-cream-100/70">
                Shop
              </h6>

              <div className="mt-4 flex flex-col gap-2">
                {navItems
                  .filter(
                    (item) => item.url !== "/about" && item.url !== "/contact",
                  )
                  .map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.url}
                      className="group w-fit text-sm text-brand-cream-400 transition-colors hover:text-brand-cream-100"
                    >
                      <span
                        className="
                          relative
                          after:absolute
                          after:-bottom-1
                          after:left-0
                          after:h-[2px]
                          after:w-0
                          after:bg-brand-red-500
                          after:transition-all
                          after:duration-300
                          group-hover:after:w-full
                        "
                      >
                        {item.name}
                      </span>
                    </NavLink>
                  ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <h6 className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-cream-100/70">
                Company
              </h6>

              <div className="mt-4 flex flex-col gap-2">
                {navItems
                  .filter(
                    (item) =>
                      item.url !== "/" &&
                      item.url !== "/angebote" &&
                      item.url !== "/shop",
                  )
                  .map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.url}
                      className="group w-fit text-sm text-brand-cream-400 transition-colors hover:text-brand-cream-100"
                    >
                      <span
                        className="
                          relative
                          after:absolute
                          after:-bottom-1
                          after:left-0
                          after:h-[2px]
                          after:w-0
                          after:bg-brand-red-500
                          after:transition-all
                          after:duration-300
                          group-hover:after:w-full
                        "
                      >
                        {item.name}
                      </span>
                    </NavLink>
                  ))}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h6 className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-cream-100/70">
                Social Media
              </h6>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="
                    group
                    flex h-11 w-11 items-center justify-center
                    rounded-full
                    border border-brand-cream-100/20
                    bg-brand-cream-100/10
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:border-brand-red-500
                    hover:bg-brand-red-500
                  "
                >
                  <FaInstagram className="h-4 w-4 text-brand-cream-100 transition-colors" />
                </a>

                <a
                  href="#"
                  aria-label="Facebook"
                  className="
                    group
                    flex h-11 w-11 items-center justify-center
                    rounded-full
                    border border-brand-cream-100/20
                    bg-brand-cream-100/10
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:border-brand-red-500
                    hover:bg-brand-red-500
                  "
                >
                  <FaFacebookF className="h-4 w-4 text-brand-cream-100 transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-brand-cream-100/15" />

          {/* Bottom */}
          <div className="flex flex-col items-center py-5 text-sm text-brand-cream-400 sm:flex-row">
            <p>
              © {new Date().getFullYear()} Anadolu Gıda — All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
