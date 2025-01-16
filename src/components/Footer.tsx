import { useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";
import { AboutSection } from "./footer/AboutSection";
import { CustomerServiceSection } from "./footer/CustomerServiceSection";
import { SocialSection } from "./footer/SocialSection";
import { CompanyInfoSection } from "./footer/CompanyInfoSection";

export const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-gray-50 py-8">
      <div className="container px-4 md:px-8">
        <Separator className="mb-8" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <AboutSection onNavigate={handleNavigation} />
          <CustomerServiceSection onNavigate={handleNavigation} />
          <SocialSection />
          <CompanyInfoSection />
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Lyxdeal. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
};