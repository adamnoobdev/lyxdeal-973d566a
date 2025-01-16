import { FC } from "react";

interface AboutSectionProps {
  onNavigate: (path: string) => void;
}

export const AboutSection: FC<AboutSectionProps> = ({ onNavigate }) => {
  return (
    <div className="text-center sm:text-left">
      <h3 className="font-semibold text-lg mb-4">Om oss</h3>
      <ul className="space-y-2">
        <li>
          <button 
            onClick={() => onNavigate('/about')} 
            className="text-gray-600 hover:text-gray-900"
          >
            Om företaget
          </button>
        </li>
        <li>
          <button 
            onClick={() => onNavigate('/contact')} 
            className="text-gray-600 hover:text-gray-900"
          >
            Kontakta oss
          </button>
        </li>
        <li>
          <button 
            onClick={() => onNavigate('/admin')} 
            className="text-gray-600 hover:text-gray-900"
          >
            Adminsida
          </button>
        </li>
      </ul>
    </div>
  );
};