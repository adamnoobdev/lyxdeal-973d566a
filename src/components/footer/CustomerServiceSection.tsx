
import { useNavigate } from "react-router-dom";

interface CustomerServiceSectionProps {
  onNavigate: (path: string) => void;
}

export const CustomerServiceSection = ({ onNavigate }: CustomerServiceSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Kundservice</h3>
      
      <ul className="space-y-2">
        <li>
          <button 
            onClick={() => onNavigate('/faq')}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Vanliga frågor
          </button>
        </li>
        <li>
          <button 
            onClick={() => onNavigate('/terms')}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Allmänna villkor
          </button>
        </li>
        <li>
          <button 
            onClick={() => onNavigate('/privacy')}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Integritetspolicy
          </button>
        </li>
      </ul>
      
      <div className="pt-2">
        <p className="text-sm text-gray-600">
          Har du frågor? Kontakta oss på<br />
          <a 
            href="mailto:info@lyxdeal.se" 
            className="text-primary hover:underline"
          >
            info@lyxdeal.se
          </a>
        </p>
      </div>
    </div>
  );
};
