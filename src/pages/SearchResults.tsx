import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DealCard } from "@/components/DealCard";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";

const deals = [
  {
    id: 1,
    title: "Premium Botox-behandling",
    description: "Omfattande behandling för panna, kråksparkar och glabellan med marknadsledande Botox",
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",
    originalPrice: 4990,
    discountedPrice: 2995,
    timeRemaining: "24 timmar kvar",
    category: "Rynkbehandlingar",
    city: "Stockholm",
  },
  {
    id: 2,
    title: "Helkropps Laserhårborttagning",
    description: "Komplett paket med 6 behandlingar för hela kroppen med senaste Soprano-teknologin",
    imageUrl: "https://images.unsplash.com/photo-1598524374912-6b0b0bdd5e4e?w=800",
    originalPrice: 12990,
    discountedPrice: 6495,
    timeRemaining: "48 timmar kvar",
    category: "Laserhårborttagning",
    city: "Göteborg",
  },
  {
    id: 3,
    title: "Lyxig Hårtransformation",
    description: "Komplett makeover med klippning, balayage och Olaplex-behandling",
    imageUrl: "https://images.unsplash.com/photo-1560869713-da86bd4f31b7?w=800",
    originalPrice: 3990,
    discountedPrice: 1995,
    timeRemaining: "72 timmar kvar",
    category: "Hårvård",
    city: "Malmö",
  },
  {
    id: 4,
    title: "Läppförstoring Premium",
    description: "Naturlig volym med Juvederm Volbella XC, inkl. konsultation och återbesök",
    imageUrl: "https://images.unsplash.com/photo-1588528402605-1f9d0eb7a6d6?w=800",
    originalPrice: 4990,
    discountedPrice: 2995,
    timeRemaining: "5 dagar kvar",
    category: "Fillers",
    city: "Stockholm",
  },
  {
    id: 5,
    title: "Kindförstoring med Filler",
    description: "Definiera ansiktskonturer med premium Restylane Lyft, inkl. bedövning",
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",
    originalPrice: 5990,
    discountedPrice: 3495,
    timeRemaining: "3 dagar kvar",
    category: "Fillers",
    city: "Göteborg",
  },
  {
    id: 6,
    title: "Lyxig Spa-manikyr",
    description: "2 timmars behandling med handmassage, paraffinbad och gel-lack",
    imageUrl: "https://images.unsplash.com/photo-1610992015732-2449b0dd2b8f?w=800",
    originalPrice: 1290,
    discountedPrice: 795,
    timeRemaining: "4 dagar kvar",
    category: "Naglar",
    city: "Uppsala",
  },
  {
    id: 7,
    title: "Hot Stone Massage Deluxe",
    description: "90 minuters avkopplande massage med varma lavastenar och aromaterapi",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
    originalPrice: 1590,
    discountedPrice: 895,
    timeRemaining: "6 dagar kvar",
    category: "Massage",
    city: "Linköping",
  },
  {
    id: 8,
    title: "Medicinsk Hudvårdsbehandling",
    description: "Djupgående behandling med AHA/BHA-syror och LED-ljusterapi",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",
    originalPrice: 1990,
    discountedPrice: 995,
    timeRemaining: "4 dagar kvar",
    category: "Hudvård",
    city: "Stockholm",
  }
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "Alla Erbjudanden";
  const cityParam = searchParams.get("city") || "Alla Städer";
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedCity, setSelectedCity] = useState(cityParam);

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSelectedCity(cityParam);
  }, [categoryParam, cityParam]);

  const filteredDeals = deals.filter((deal) => {
    const matchesCategory =
      selectedCategory === "Alla Erbjudanden" || deal.category === selectedCategory;
    const matchesCity =
      selectedCity === "Alla Städer" || deal.city === selectedCity;
    const matchesSearch = searchQuery
      ? deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.city.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesCity && matchesSearch;
  });

  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category !== "Alla Erbjudanden") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    window.history.pushState({}, "", `?${params.toString()}`);
    setSelectedCategory(category);
  };

  const handleCitySelect = (city: string) => {
    const params = new URLSearchParams(searchParams);
    if (city !== "Alla Städer") {
      params.set("city", city);
    } else {
      params.delete("city");
    }
    window.history.pushState({}, "", `?${params.toString()}`);
    setSelectedCity(city);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery
              ? `Sökresultat för "${searchQuery}"`
              : selectedCategory}
          </h1>
          <p className="text-gray-600">
            {filteredDeals.length} erbjudanden hittades
          </p>
        </div>

        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        <Cities
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDeals.map((deal) => (
            <DealCard key={deal.id} {...deal} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;