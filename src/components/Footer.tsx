
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SocialSection } from "@/components/footer/SocialSection";
import { CustomerServiceSection } from "@/components/footer/CustomerServiceSection";
import { PartnerSection } from "@/components/footer/PartnerSection";
import { CookieSettings } from "@/components/cookie/CookieSettings";
import Logo from "@/components/navigation/Logo";

export function Footer() {
  const handleNavigate = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="mt-auto bg-gray-50 pt-10 border-t border-gray-200">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="mb-10 flex justify-center">
          <div className="w-40">
            <Logo className="w-full h-auto" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-8 max-w-md mx-auto text-center">
          <CustomerServiceSection onNavigate={handleNavigate} />
          <PartnerSection onNavigate={handleNavigate} />
          <SocialSection />
        </div>
        <Separator className="my-6 max-w-md w-full" />
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Lyxdeal. Alla rättigheter förbehållna.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
