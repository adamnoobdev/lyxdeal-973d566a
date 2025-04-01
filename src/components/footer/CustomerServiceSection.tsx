
import { FC } from "react";
import { Link } from "react-router-dom";

interface CustomerServiceSectionProps {
  onNavigate: (path: string) => void;
}

export const CustomerServiceSection: FC<CustomerServiceSectionProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="font-semibold text-lg mb-4">Kundservice</h3>
      <ul className="space-y-2">
        <li>
          <Link 
            to="/faq" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Visa vanliga frågor"
            onClick={() => window.scrollTo(0, 0)}
          >
            Vanliga frågor
          </Link>
        </li>
        <li>
          <Link 
            to="/terms" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Visa allmänna villkor"
            onClick={() => window.scrollTo(0, 0)}
          >
            Allmänna villkor
          </Link>
        </li>
        <li>
          <Link 
            to="/privacy" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Visa integritetspolicy"
            onClick={() => window.scrollTo(0, 0)}
          >
            Integritetspolicy
          </Link>
        </li>
      </ul>
    </div>
  );
};
