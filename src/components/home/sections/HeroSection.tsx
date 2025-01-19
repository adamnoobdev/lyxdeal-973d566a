import { useNavigate } from "react-router-dom";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CATEGORIES } from "@/constants/app-constants";

export function HeroSection() {
  const navigate = useNavigate();
  const HERO_IMAGE_URL = "https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets/hero-background.jpg";

  const handleCategorySelect = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center rounded-2xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90 transition-opacity duration-700"
          style={{ 
            backgroundImage: `url('${HERO_IMAGE_URL}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div 
          className="absolute inset-0 bg-black/20"
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 md:space-y-8 py-12 md:py-16">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg px-4">
              Skönhetsbehandlingar till Bästa Pris
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow px-4">
              Upp till 70% rabatt på Sveriges främsta salonger
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto px-4">
            {CATEGORIES.filter(cat => cat !== "Alla Erbjudanden").map((category) => (
              <CategoryBadge 
                key={category}
                category={category}
                variant="outline"
                className="cursor-pointer bg-white/90 hover:bg-white text-primary hover:text-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
                onClick={() => handleCategorySelect(category)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}