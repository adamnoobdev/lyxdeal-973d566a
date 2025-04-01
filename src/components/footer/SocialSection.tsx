
import { FC } from "react";
import { Facebook, Instagram } from "lucide-react";

export const SocialSection: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="font-semibold text-lg mb-4">Följ oss</h3>
      <div className="flex flex-row space-x-4 mt-2">
        <a 
          href="https://www.facebook.com/profile.php?id=61574494333844" 
          className="text-gray-600 hover:text-primary transition-colors" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Besök vår Facebook-sida"
        >
          <Facebook className="h-5 w-5" />
        </a>
        <a 
          href="https://www.instagram.com/lyxdeal.se/" 
          className="text-gray-600 hover:text-primary transition-colors" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Besök vår Instagram-sida"
        >
          <Instagram className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};
