
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function PromotionBanner() {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full mb-8 max-w-5xl mx-auto">
      <Link to="/partner" className="block w-full">
        <div className="relative w-full overflow-hidden rounded-md shadow-md" style={{ 
          paddingTop: isMobile ? '25%' : '20%',
        }}>
          <img 
            src="https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets//Promotion%20bild.jpg"
            alt="Bli partner med Lyxdeal" 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      </Link>
    </div>
  );
}
