import { NavLink } from "react-router-dom";
import logo from "/anadolugida.png";
import menuItems from "@/features/dashboard/constants/menuItems";

const Sidebar = () => {
  const logoutItem = menuItems.find((item) => item.path === "/dashboard/logout");
  const mainMenu = menuItems.filter((item) => item.path !== "/dashboard/logout");

  return (
    <div className="drawer-side z-40 is-drawer-close:overflow-visible">
      <label
        htmlFor="admin-dashboard-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      />

      <aside className="flex min-h-full w-80 max-w-[85vw] flex-col border-r border-base-200 bg-base-100 transition-all duration-300 lg:is-drawer-close:w-20 lg:is-drawer-open:w-72">

        {/* Logo */}
        <div className="border-b border-base-300">
          <NavLink to="/" className="flex items-center gap-4 px-3 py-4">
            <div className="flex h-10 w-13.5 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <img
                src={logo}
                alt="Anadolu Gıda"
                className="h-8 w-auto object-contain"
              />
            </div>

            <div className="min-w-0 lg:is-drawer-close:hidden">
              <p className="truncate text-sm font-semibold leading-none text-base-content">
                Anadolu Gıda
              </p>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col px-3 py-8">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-base-content/40 lg:is-drawer-close:hidden">
            Navigation
          </p>

          {/* Main Menu */}
          <ul className="menu w-full gap-1 p-0">
            {mainMenu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/dashboard"}
                  data-tip={item.label}
                  className={({ isActive }) =>
                    [
                      "group relative flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200",
                      "lg:is-drawer-close:tooltip lg:is-drawer-close:tooltip-right lg:is-drawer-close:justify-center",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-base-content/70 hover:bg-base-200/80 hover:text-base-content",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full transition ${isActive ? "bg-primary" : "bg-transparent"
                          }`}
                      />
                      <span className="shrink-0">{item.icon}</span>
                      <span className="lg:is-drawer-close:hidden">
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Logout - en aşağı */}
          {logoutItem && (
            <ul className="menu mt-auto w-full gap-1 p-0 pt-6 border-t border-base-300">
              <li>
                <NavLink
                  to={logoutItem.path}
                  data-tip={logoutItem.label}
                  className="group relative flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium text-error hover:bg-error/10 transition-all duration-200 lg:is-drawer-close:tooltip lg:is-drawer-close:tooltip-right lg:is-drawer-close:justify-center"
                >
                  <span className="shrink-0">{logoutItem.icon}</span>
                  <span className="lg:is-drawer-close:hidden">
                    {logoutItem.label}
                  </span>
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;