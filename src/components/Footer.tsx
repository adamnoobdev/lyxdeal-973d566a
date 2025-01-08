import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";

export const Footer = () => {
  return (
    <footer className="mt-16 bg-gray-50 py-8">
      <div className="container">
        <Separator className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Om oss</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  Om företaget
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                  Kontakta oss
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                  Adminsida
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Kundservice</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-gray-900">
                  Vanliga frågor
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                  Villkor
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
                  Integritetspolicy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Följ oss</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://facebook.com" className="text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" className="text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" className="text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} DealSite. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
};