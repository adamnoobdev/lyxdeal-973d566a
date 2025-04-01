
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { CookieSettings } from "@/components/cookie/CookieSettings";
import Logo from "@/components/navigation/Logo";

export function Footer() {
  const handleNavigate = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="mt-auto bg-gray-50 pt-10 border-t border-gray-200">
      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col items-center mb-10">
          <Logo className="w-48 h-auto text-primary" />
        </div>
        
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Link 
            to="/help" 
            className="text-gray-600 hover:text-primary transition-colors"
            onClick={handleNavigate}
          >
            Kundtjänst
          </Link>
          
          <Link 
            to="/newsletter" 
            className="text-gray-600 hover:text-primary transition-colors"
            onClick={handleNavigate}
          >
            Prenumerera på nyhetsbrevet
          </Link>
          
          <Link 
            to="/data-sharing" 
            className="text-gray-600 hover:text-primary transition-colors"
            onClick={handleNavigate}
          >
            Medgivande för datadelning
          </Link>
          
          <Link 
            to="/terms" 
            className="text-gray-600 hover:text-primary transition-colors"
            onClick={handleNavigate}
          >
            Allmänna villkor
          </Link>
          
          <Link 
            to="/privacy" 
            className="text-gray-600 hover:text-primary transition-colors"
            onClick={handleNavigate}
          >
            Integritetspolicy
          </Link>
          
          <div className="flex items-center">
            <CookieSettings />
          </div>
          
          <Link 
            to="/partner" 
            className="text-gray-600 hover:text-primary transition-colors"
            onClick={handleNavigate}
          >
            Bli partner
          </Link>
        </div>
        
        {/* App store links */}
        <div className="flex justify-center space-x-4 mb-8">
          <a 
            href="#" 
            className="inline-block" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Ladda ner från App Store"
          >
            <img 
              src="/lovable-uploads/2cf83593-33b3-4f0c-8969-1a87bb18f104.png" 
              alt="App Store" 
              className="h-10 w-auto object-contain" 
            />
          </a>
          <a 
            href="#" 
            className="inline-block" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Ladda ner från Google Play"
          >
            <img 
              src="/lovable-uploads/2cf83593-33b3-4f0c-8969-1a87bb18f104.png" 
              alt="Google Play" 
              className="h-10 w-auto object-contain" 
            />
          </a>
        </div>
        
        <Separator className="my-6" />
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Lyxdeal. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
}
