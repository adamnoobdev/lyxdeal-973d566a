import { useNavigate } from "react-router-dom";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CATEGORIES } from "@/constants/app-constants";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();

  const handleCategorySelect = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center px-4 overflow-hidden">
      {/* Enhanced gradient background with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/95 via-secondary-500/95 to-accent-300/95">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-300/30 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-secondary-300/30 to-transparent rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Upptäck nya erbjudanden varje dag</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Upptäck Skönhet & Välbefinnande
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Exklusiva erbjudanden från Sveriges bästa salonger
          </p>
        </div>
        
        <div 
          className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          {CATEGORIES.filter(cat => cat !== "Alla Erbjudanden").map((category, index) => (
            <CategoryBadge 
              key={category}
              category={category}
              variant="default"
              className="cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 shadow-lg"
              onClick={() => handleCategorySelect(category)}
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}