import { CATEGORIES } from "@/constants/app-constants";
import { CategoryBadge } from "../CategoryBadge";

export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-secondary to-accent min-h-[500px] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
            Upptäck Skönhet & Välbefinnande
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Exklusiva erbjudanden från Sveriges bästa salonger
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {CATEGORIES.filter(cat => cat !== "Alla Erbjudanden").map((category) => (
            <CategoryBadge 
              key={category}
              category={category}
              variant="default"
              className="cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
            />
          ))}
        </div>
      </div>
    </section>
  );
};