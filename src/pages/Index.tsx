
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { MainContent } from "@/components/home/index/MainContent";
import { useLocation } from "react-router-dom";
import { City, CITIES, CATEGORIES } from "@/constants/app-constants";
import { PageMetadata } from "@/components/seo/PageMetadata";

export default function IndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState<string>("Alla Städer");
  const location = useLocation();
  
  // Handle city selection from navigation or direct link
  useEffect(() => {
    if (location.state?.selectedCity) {
      setSelectedCity(location.state.selectedCity as City);
      // Clear the location state to avoid persisting the selection on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Strukturerad data för sitelinks
  const sitelinksData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Lyxdeal",
    "url": "https://lyxdeal.se/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://lyxdeal.se/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://facebook.com/lyxdeal",
      "https://instagram.com/lyxdeal_sverige"
    ]
  };

  // Organization schema data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Lyxdeal",
    "description": "Platform för skönhetserbjudanden och behandlingar i Sverige",
    "url": "https://lyxdeal.se",
    "logo": "https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets/24x-mini-icon.png",
    "sameAs": [
      "https://facebook.com/lyxdeal",
      "https://instagram.com/lyxdeal_sverige"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "kontakt@lyxdeal.se"
    }
  };

  // Generera strukturerad data för olika städer
  const localBusinessData = CITIES.filter(city => city !== "Alla Städer").map(city => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Lokala deals i ${city}`,
    "itemListElement": CATEGORIES.filter(cat => cat !== "Alla Erbjudanden").slice(0, 4).map((category, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": category,
      "url": `https://lyxdeal.se/search?city=${city}&category=${category}`
    }))
  }));

  // Combine all structured data
  const structuredData = [
    sitelinksData,
    organizationData,
    ...localBusinessData
  ];

  return (
    <>
      <PageMetadata
        title="Lyxdeal - Upptäck Sveriges Bästa Skönhetserbjudanden"
        description="Tusentals rabatter på skönhetsbehandlingar och lokala erbjudanden i Stockholm, Göteborg och Malmö. Spara stort på skönhetsbehandlingar, spa, laser och mycket mer."
        structuredData={structuredData}
        canonicalPath="/"
      >
        <meta name="keywords" content="skönhetserbjudanden, rabatt på skönhetsvård, skönhetsbehandlingar, hårvård, hudvård, nagelvård, spa, massage, Stockholm, Göteborg, Malmö" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </PageMetadata>
      
      <main className="flex flex-col min-h-screen bg-background pb-12">
        <HeroSection />
        <MainContent 
          selectedCategory={selectedCategory}
          selectedCity={selectedCity}
          onSelectCategory={setSelectedCategory}
          onSelectCity={setSelectedCity}
        />
      </main>
    </>
  );
}
