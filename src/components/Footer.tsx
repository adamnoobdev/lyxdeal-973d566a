import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-16 bg-gray-50 py-8">
      <div className="container px-4 md:px-8">
        <Separator className="mb-8" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="text-center sm:text-left">
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
          
          <div className="text-center sm:text-left">
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
          
          <div className="text-center sm:text-left">
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

          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-lg mb-4">Företagsinformation</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p>Larlid & Co AB</p>
                  <p>Org.nr: 5593608051</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                <p>Västra Granittrappan 10<br />131 57 Nacka</p>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <a href="mailto:info@larlid.com" className="hover:text-gray-900">
                  info@larlid.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <a href="tel:+46101774400" className="hover:text-gray-900">
                  010-177 44 00
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Lyxdeal. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
};