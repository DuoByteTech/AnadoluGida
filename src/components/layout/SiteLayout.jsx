import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./Footer";

const SiteLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Full width */}
      <Header />

      {/* Centered content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-0">
          <Outlet />
        </div>
      </main>

      {/* Full width */}
      <Footer />
    </div>
  );
};

export default SiteLayout;