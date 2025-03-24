
import { useState } from "react";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { MainContent } from "@/components/home/index/MainContent";
import { Helmet } from "react-helmet";

export default function IndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState<string>("Alla Städer");

  return (
    <>
      <Helmet>
        <title>Lyxdeal - Upptäck Sveriges Bästa Skönhetserbjudanden</title>
        <meta name="description" content="Hitta och boka de bästa skönhetserbjudandena från Sveriges främsta salonger. Spara pengar på behandlingar och upptäck nya favoritsalonger." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="canonical" href="https://lyxdeal.se" />
      </Helmet>
      
      <main className="flex flex-col min-h-screen bg-background">
        <HeroSection />
        <div className="container mx-auto py-6 md:py-8">
          <MainContent 
            selectedCategory={selectedCategory}
            selectedCity={selectedCity}
            onSelectCategory={setSelectedCategory}
            onSelectCity={setSelectedCity}
          />
        </div>
      </main>
    </>
  );
}
