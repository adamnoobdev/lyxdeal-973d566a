
import { useNavigate } from "react-router-dom";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CATEGORIES } from "@/constants/app-constants";

export function HeroSection() {
  const navigate = useNavigate();
  const HERO_IMAGE_URL = "https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets/hero-background.jpg";
  
  // Select categories to display (excluding "Alla Erbjudanden")
  const displayCategories = CATEGORIES.filter(cat => cat !== "Alla Erbjudanden");

  const handleCategorySelect = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden my-6">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{ 
          backgroundImage: `url('${HERO_IMAGE_URL}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div 
        className="absolute inset-0 bg-black/20"
      />
      <div className="container mx-auto px-4">
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 md:space-y-8 py-12 md:py-16">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
              Upptäck Sveriges Bästa Skönhetserbjudanden
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-medium drop-shadow">
              Exklusiva erbjudanden från Sveriges främsta skönhetssalonger
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mx-auto max-w-3xl">
            {displayCategories.map((category) => (
              <CategoryBadge 
                key={category}
                category={category}
                variant="outline"
                className="cursor-pointer bg-white/90 hover:bg-white text-primary hover:text-primary-600 shadow-lg"
                onClick={() => handleCategorySelect(category)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
