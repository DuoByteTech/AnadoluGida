import {
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

import { useNavigate } from "react-router-dom";

import useAuth from "@/features/auth/hooks/useAuth";

const Topbar = ({ isSidebarOpen, onToggleSidebar }) => {
  const navigate = useNavigate();

  const { profile, logout } = useAuth();

  const firstName = profile?.first_name?.trim() || "";
  const lastName = profile?.last_name?.trim() || "";

  const fullName = `${firstName} ${lastName}`.trim() || "Admin";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "A";

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar sticky top-0 z-30 border-b border-base-300 bg-base-100 px-3 py-4 md:px-4">
      <div className="flex-1">
        <button
          type="button"
          aria-label="toggle sidebar"
          onClick={onToggleSidebar}
          className="btn btn-square btn-ghost ml-1 rounded-full transition-all duration-200 hover:scale-105 hover:border-error/40 hover:bg-error/10 hover:shadow-md"
        >
          {isSidebarOpen ? (
            <ChevronLeftIcon className="size-5" />
          ) : (
            <ChevronRightIcon className="size-5" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            className="theme-controller"
            value="synthwave"
          />

          <SunIcon className="swap-off size-6 text-base-content" />
          <MoonIcon className="swap-on size-6 text-base-content" />
        </label>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost gap-2 rounded-full px-3 normal-case transition-all duration-200 hover:scale-105 hover:bg-base-200"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error/70 font-semibold text-primary">
              {initials}
            </div>

            <span className="text-sm font-medium">{fullName}</span>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 w-56 rounded-xl border border-base-200 bg-base-100 p-2 shadow-xl"
          >
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg py-3 text-error hover:bg-error/10"
              >
                <ArrowRightOnRectangleIcon className="size-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
