import { ChevronLeftIcon, ChevronRightIcon, UserIcon, ArrowRightOnRectangleIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const Topbar = ({ isSidebarOpen, onToggleSidebar }) => {
  return (
    <nav className="navbar sticky top-0 z-30 border-b border-base-300 bg-base-100 px-3 md:px-4 py-4">
      <div className="flex-1">
        <button
          type="button"
          aria-label="toggle sidebar"
          onClick={onToggleSidebar}
          className="btn btn-square btn-ghost hover:border-error/40 ml-1 rounded-full transition-all duration-200 hover:bg-error/10 hover:scale-105 hover:shadow-md"
        >
          {isSidebarOpen ? (
            <ChevronLeftIcon className="size-5" />
          ) : (
            <ChevronRightIcon className="size-5" />
          )}
        </button>
      </div>

      <div className="flex gap-3">

        <label className="swap swap-rotate">
          {/* theme controller */}
          <input type="checkbox" className="theme-controller" value="synthwave" />

          {/* Sun */}
          <SunIcon className="swap-off size-6 text-base-content" />

          {/* Moon */}
          <MoonIcon className="swap-on size-6 text-base-content" />
        </label>


        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost gap-2 normal-case rounded-full px-3 transition-all duration-200 hover:bg-base-200 hover:scale-105"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error/70 text-primary font-semibold">
              OA
            </div>

            <span className="text-sm font-medium">Onur Aydınoğlu</span>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 w-56 rounded-xl border border-base-200 bg-base-100 p-2 shadow-xl"
          >
            <li>
              <a className="flex items-center gap-3 rounded-lg hover:bg-base-200 py-3">
                <UserIcon className="size-4 opacity-70" />
                Profile
              </a>
            </li>

            <div className="my-1 border-t border-base-200"></div>

            <li>
              <a className="flex items-center gap-3 rounded-lg text-error hover:bg-error/10 py-3">
                <ArrowRightOnRectangleIcon className="size-4" />
                Logout
              </a>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
};

export default Topbar;