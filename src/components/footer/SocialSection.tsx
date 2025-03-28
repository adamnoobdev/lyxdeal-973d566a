
import { FC } from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export const SocialSection: FC = () => {
  return (
    <div className="text-center sm:text-left">
      <h3 className="font-semibold text-lg mb-4">Följ oss</h3>
      <div className="flex flex-row justify-center sm:justify-start space-x-4 mt-2">
        <a 
          href="https://facebook.com" 
          className="text-gray-600 hover:text-primary transition-colors" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Besök vår Facebook-sida"
        >
          <Facebook className="h-5 w-5" />
        </a>
        <a 
          href="https://instagram.com" 
          className="text-gray-600 hover:text-primary transition-colors" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Besök vår Instagram-sida"
        >
          <Instagram className="h-5 w-5" />
        </a>
        <a 
          href="https://linkedin.com" 
          className="text-gray-600 hover:text-primary transition-colors" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Besök vår LinkedIn-sida"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};
