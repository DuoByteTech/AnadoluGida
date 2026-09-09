import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="drawer lg:drawer-open">
        <input
          id="admin-dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isSidebarOpen}
          onChange={handleToggleSidebar}
        />

        <div className="drawer-content flex flex-col">
          <Topbar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
          />

          <main className="flex-1 bg-base-200 p-4 md:p-7">
            <Outlet />
          </main>
        </div>

        <Sidebar onNavigate={handleCloseSidebar} />
      </div>
    </div>
  );
};

export default DashboardLayout;
