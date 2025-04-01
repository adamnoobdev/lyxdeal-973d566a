
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function PromotionBanner() {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full mb-8">
      <Link to="/partner" className="block w-full">
        <img 
          src="https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets//Promotion%20bild.jpg"
          alt="Bli partner med Lyxdeal" 
          className="w-full object-cover rounded-md shadow-md"
          style={{ maxHeight: isMobile ? '180px' : '300px' }}
        />
      </Link>
    </div>
  );
}
