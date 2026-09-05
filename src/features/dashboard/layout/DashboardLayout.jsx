import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="drawer lg:drawer-open">
        <input id="admin-dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isSidebarOpen}
          onChange={() => setIsSidebarOpen((prev) => !prev)}
        />

        <div className="drawer-content flex flex-col">
          <Topbar isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

          <main className="flex-1 bg-base-200 p-4 md:p-7">
            <Outlet />
          </main>
        </div>

        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;