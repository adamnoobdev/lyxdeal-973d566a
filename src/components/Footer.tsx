
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SocialSection } from "@/components/footer/SocialSection";
import { CustomerServiceSection } from "@/components/footer/CustomerServiceSection";
import { PartnerSection } from "@/components/footer/PartnerSection";
import { CompanyInfoSection } from "@/components/footer/CompanyInfoSection";
import { CookieSettings } from "@/components/cookie/CookieSettings";
import Logo from "@/components/navigation/Logo";

export function Footer() {
  const handleNavigate = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="mt-auto bg-gray-50 pt-10 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex justify-center">
          <div className="w-40 md:w-48">
            <Logo />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <CustomerServiceSection onNavigate={handleNavigate} />
          <PartnerSection onNavigate={handleNavigate} />
          <SocialSection />
          <CompanyInfoSection />
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between py-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Lyxdeal. Alla rättigheter förbehållna.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-700">
              Villkor
            </Link>
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-700">
              Integritetspolicy
            </Link>
            <CookieSettings />
          </div>
        </div>
      </div>
    </footer>
  );
}
