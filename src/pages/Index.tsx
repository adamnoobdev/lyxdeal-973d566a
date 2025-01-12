import { useState } from "react";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { MainContent } from "@/components/home/index/MainContent";

export default function IndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState<string>("Alla Städer");

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <MainContent 
        selectedCategory={selectedCategory}
        selectedCity={selectedCity}
        onSelectCategory={setSelectedCategory}
        onSelectCity={setSelectedCity}
      />
    </div>
  );
}