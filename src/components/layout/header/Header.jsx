import { useState } from "react";
import { NavLink } from "react-router-dom";

import Search from "@/components/ui/Search";
import { PhoneIcon, Bars3BottomRightIcon, } from "@heroicons/react/24/outline";

import navItems from "../constants/navItems";
import logo from "@/assets/anadolugida.png";

import ShopMegaMenu from "./ShopMegaMenu";
import MobileDrawer from "./MobileDrawer";

/* ---------------- Helpers ---------------- */
const linkClass = () => `
  relative text-sm font-medium tracking-wide pb-1
  text-base-content/70 hover:text-base-content
  !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent
  transition-colors duration-200
  after:absolute after:left-0 after:bottom-0
  after:h-[1px] after:bg-error
  after:w-0 after:transition-all after:duration-300
  hover:after:w-full
`;

const Header = () => {
  const [shopOpen, setShopOpen] = useState(false); // desktop mega
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  return (
    <>
      {/* TOP BAR */}
      <div className="w-full bg-base-100 shadow-sm mb-10 lg:mb-0">
        <div className="container mx-auto">
          <div className="navbar">
            <div className="navbar-start">
              <NavLink to="/" className="ml-1">
                <img
                  src={logo}
                  alt="Anadolu Gıda"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </NavLink>
            </div>

            {/* Desktop search */}
            <div className="navbar-center hidden lg:flex">
              <Search className="!w-[500px] max-w-none" />
            </div>

            <div className="navbar-end flex items-center gap-3">
              {/* Desktop phone */}
              <a
                href="tel:+491732461008"
                className="hidden sm:flex items-center gap-2 border border-error/40 rounded-full px-4 py-2 hover:bg-error/10 transition duration-200"
              >
                <PhoneIcon className="w-4 h-4 text-error" />
                <span className="font-medium">+49 173 2461008</span>
              </a>

              {/* Mobile phone icon only */}
              <a
                href="tel:+491732461008"
                className="btn btn-ghost btn-sm sm:hidden"
                aria-label="Call"
              >
                <PhoneIcon className="h-5 w-5 text-error" />
              </a>

              {/* Mobile hamburger */}
              <button
                type="button"
                className="btn btn-ghost lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Bars3BottomRightIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM NAV (desktop only) */}
      <div className="w-full bg-base-100 hidden lg:block">
        <div className="container mx-auto">
          <div className="navbar relative min-h-0 py-2">
            <ul className="menu menu-horizontal gap-2 bg-transparent -ml-4">
              {navItems.map((item) => {
                if (item.url === "/shop") {
                  return (
                    <li key={item.id} className="flex">
                      <button
                        type="button"
                        onClick={() => setShopOpen((v) => !v)}
                        className={`
                          relative text-sm font-medium tracking-wide pb-1
                          !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent
                          transition-colors duration-200
                          ${shopOpen ? "text-error" : "text-base-content/70 hover:text-base-content"}
                          after:absolute after:left-0 after:bottom-0
                          after:h-[1px] after:bg-error
                          after:w-0 after:transition-all after:duration-300
                          hover:after:w-full
                        `}
                      >
                        {item.name}
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={item.id} className="flex">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={() => linkClass()}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            <ShopMegaMenu open={shopOpen} onClose={() => setShopOpen(false)} />
          </div>
        </div>
      </div>

      <div className="container mx-auto hidden lg:block">
        <div className="divider mt-0 mb-5"></div>
      </div>

      {/* MOBILE DRAWER */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};

export default Header;