import DashboardAboutHeader from "../components/DashboardAboutPage/DashboardAboutHeader";
import AboutSection from "@/features/about/components/AboutSection";

import { aboutContent } from "@/features/about/data/aboutData";

const DashboardAboutPage = () => {
  return (
    <div className="space-y-6">
      <DashboardAboutHeader />
      <AboutSection content={aboutContent} />
    </div>
  );
};

export default DashboardAboutPage;