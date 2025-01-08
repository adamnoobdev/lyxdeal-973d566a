import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DealCard } from "@/components/DealCard";
import { FeaturedDeals } from "@/components/FeaturedDeals";

const featuredDeals = [
  {
    id: 5,
    title: "Komplett Ansiktsbehandling",
    description: "Lyxig ansiktsbehandling med djuprengöring, peeling och mask",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",
    originalPrice: 1990,
    discountedPrice: 990,
    timeRemaining: "48 timmar kvar",
    category: "Hudvård",
  },
  {
    id: 6,
    title: "Permanent Hårborttagning",
    description: "6 behandlingar med senaste laserteknologin",
    imageUrl: "https://images.unsplash.com/photo-1598524374912-6b0b0bdd5e4e?w=800",
    originalPrice: 9990,
    discountedPrice: 4990,
    timeRemaining: "24 timmar kvar",
    category: "Laserhårborttagning",
  },
  {
    id: 7,
    title: "Lyxigt Hårvårdspaket",
    description: "Klippning, färgning och keratinbehandling",
    imageUrl: "https://images.unsplash.com/photo-1560869713-da86bd4f31b7?w=800",
    originalPrice: 2990,
    discountedPrice: 1495,
    timeRemaining: "72 timmar kvar",
    category: "Hårvård",
  }
];

const deals = [
  {
    id: 1,
    title: "Fillers Läppar",
    description: "Naturlig volym med premium hyaluronsyra",
    imageUrl: "https://images.unsplash.com/photo-1588528402605-1f9d0eb7a6d6?w=800",
    originalPrice: 4000,
    discountedPrice: 2490,
    timeRemaining: "2 dagar kvar",
    category: "Fillers",
  },
  {
    id: 2,
    title: "Anti-age Behandling",
    description: "Botox för reducering av rynkor",
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",
    originalPrice: 3500,
    discountedPrice: 1990,
    timeRemaining: "3 dagar kvar",
    category: "Rynkbehandlingar",
  },
  {
    id: 3,
    title: "Lyxig Manikyr",
    description: "Omfattande nagelvård med gellack",
    imageUrl: "https://images.unsplash.com/photo-1610992015732-2449b0dd2b8f?w=800",
    originalPrice: 800,
    discountedPrice: 450,
    timeRemaining: "5 dagar kvar",
    category: "Naglar",
  },
  {
    id: 4,
    title: "Avkopplande Massage",
    description: "90 minuters helkroppsmassage",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
    originalPrice: 1200,
    discountedPrice: 790,
    timeRemaining: "7 dagar kvar",
    category: "Massage",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Alla Erbjudanden");

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleCategorySelect = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="relative mb-8">
          <FeaturedDeals deals={featuredDeals} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {deals.map((deal) => (
            <DealCard key={deal.id} {...deal} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;