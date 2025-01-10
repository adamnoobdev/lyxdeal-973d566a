import { useState } from "react";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { DealsSection } from "@/components/home/DealsSection";

export default function IndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState<string>("Alla Städer");

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <main className="flex-1 container mx-auto px-4 py-12 space-y-12">
        <StatsSection />

        <div className="space-y-8">
          <Categories 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <Cities 
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
          />
        </div>

        <DealsSection 
          selectedCategory={selectedCategory}
          selectedCity={selectedCity}
        />
      </main>
    </div>
  );
}