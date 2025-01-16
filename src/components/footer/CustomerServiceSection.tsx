import { FC } from "react";

interface CustomerServiceSectionProps {
  onNavigate: (path: string) => void;
}

export const CustomerServiceSection: FC<CustomerServiceSectionProps> = ({ onNavigate }) => {
  return (
    <div className="text-center sm:text-left">
      <h3 className="font-semibold text-lg mb-4">Kundservice</h3>
      <ul className="space-y-2">
        <li>
          <button 
            onClick={() => onNavigate('/faq')} 
            className="text-gray-600 hover:text-gray-900"
          >
            Vanliga frågor
          </button>
        </li>
        <li>
          <button 
            onClick={() => onNavigate('/terms')} 
            className="text-gray-600 hover:text-gray-900"
          >
            Allmänna villkor
          </button>
        </li>
      </ul>
    </div>
  );
};