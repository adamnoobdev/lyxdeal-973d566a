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
    <section className="relative min-h-[600px] flex items-center justify-center px-4 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70 transition-opacity duration-700"
        style={{ 
          backgroundImage: `url('${HERO_IMAGE_URL}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(102.3deg, rgba(147,39,143,0.4) 5.9%, rgba(234,172,232,0.3) 64%, rgba(246,219,245,0.2) 89%)',
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10 py-20">
        <div 
          className="space-y-6 animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
            Skönhetsbehandlingar till Bästa Pris
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow">
            Upp till 70% rabatt på Sveriges främsta salonger
          </p>
        </div>
        
        <div 
          className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          {CATEGORIES.filter(cat => cat !== "Alla Erbjudanden").map((category, index) => (
            <CategoryBadge 
              key={category}
              category={category}
              variant="outline"
              className="cursor-pointer bg-white/90 hover:bg-white text-primary hover:text-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg animate-fade-up"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              onClick={() => handleCategorySelect(category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}