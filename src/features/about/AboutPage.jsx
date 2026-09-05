import AboutSection from "./components/AboutSection";
import { aboutContent } from "./data/aboutData";

const AboutPage = () => {
  // sonra burası DB/API olacak:
  // const { data: aboutContent } = useQuery(...)
  return <AboutSection content={aboutContent} />;
};

export default AboutPage;