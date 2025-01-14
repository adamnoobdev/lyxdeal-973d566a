import { useNavigate } from "react-router-dom";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CATEGORIES } from "@/constants/app-constants";

export function HeroSection() {
  const navigate = useNavigate();

  const handleCategorySelect = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="relative min-h-[500px] flex items-center justify-center px-4 bg-background border-b">
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Upptäck Skönhet & Välbefinnande
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Exklusiva erbjudanden från Sveriges bästa salonger
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {CATEGORIES.filter(cat => cat !== "Alla Erbjudanden").map((category) => (
            <CategoryBadge 
              key={category}
              category={category}
              variant="outline"
              className="cursor-pointer transition-colors hover:bg-accent"
              onClick={() => handleCategorySelect(category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}