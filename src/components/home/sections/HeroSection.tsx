import { useNavigate } from "react-router-dom";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CATEGORIES } from "@/constants/app-constants";

export function HeroSection() {
  const navigate = useNavigate();

  const handleCategorySelect = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="relative min-h-[500px] flex items-center justify-center px-4 bg-primary-50/50">
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-5" />
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-primary-900">
            Upptäck Skönhet & Välbefinnande
          </h1>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Exklusiva erbjudanden från Sveriges bästa salonger
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {CATEGORIES.filter(cat => cat !== "Alla Erbjudanden").map((category) => (
            <CategoryBadge 
              key={category}
              category={category}
              variant="default"
              className="cursor-pointer bg-white/80 text-primary-700 hover:bg-white transition-colors"
              onClick={() => handleCategorySelect(category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}