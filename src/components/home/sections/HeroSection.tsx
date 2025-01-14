import { useNavigate } from "react-router-dom";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CATEGORIES } from "@/constants/app-constants";

export function HeroSection() {
  const navigate = useNavigate();

  const handleCategorySelect = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="relative min-h-[500px] flex items-center justify-center px-4 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 border-b border-primary-100">
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-5" />
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
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
              className="cursor-pointer bg-gradient-to-r from-primary-300 to-secondary-300 text-primary-900 border-none hover:opacity-90 transition-opacity"
              onClick={() => handleCategorySelect(category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}