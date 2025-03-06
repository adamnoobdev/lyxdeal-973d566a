
import { Button } from "../ui/button";

export const PartnerHero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10"></div>
      <div className="container px-4 md:px-8 relative z-10">
        <div className="py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Väx din salongsverksamhet med Lyxdeal
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8">
            Nå nya kunder, öka din försäljning och stärk ditt varumärke genom att bli en av våra värdefulla salongspartners.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Bli partner idag
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Läs mer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
