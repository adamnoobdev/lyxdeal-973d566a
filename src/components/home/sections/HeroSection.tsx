import { CategoryBadge } from "@/components/CategoryBadge";
import { CATEGORIES } from "@/constants/app-constants";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-500/90 via-secondary-500/90 to-accent-300/90 min-h-[500px] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay opacity-20" />
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Upptäck Skönhet & Välbefinnande
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Exklusiva erbjudanden från Sveriges bästa salonger
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "200ms" }}>
          {CATEGORIES.filter(cat => cat !== "Alla Erbjudanden").map((category) => (
            <CategoryBadge 
              key={category}
              category={category}
              variant="default"
              className="cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
            />
          ))}
        </div>
      </div>
    </section>
  );
}