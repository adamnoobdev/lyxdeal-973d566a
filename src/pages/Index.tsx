import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DealCard } from "@/components/DealCard";
import { FeaturedDeals } from "@/components/FeaturedDeals";

const featuredDeals = [
  {
    id: 5,
    title: "Lyxig Spahelg för Två",
    description: "Romantisk spaupplevelse med övernattning och behandlingar",
    imageUrl: "https://images.unsplash.com/photo-1531256379416-9f000e90aacc?w=800",
    originalPrice: 4990,
    discountedPrice: 2495,
    timeRemaining: "48 timmar kvar",
    category: "Skönhet & Spa",
  },
  {
    id: 6,
    title: "Michelin-stjärnig Matupplevelse",
    description: "7-rätters avsmakningsmeny med vinpaket",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
    originalPrice: 3990,
    discountedPrice: 2790,
    timeRemaining: "24 timmar kvar",
    category: "Restauranger",
  },
  {
    id: 7,
    title: "Exklusiv Golfhelg",
    description: "2 dagars golfpaket med boende och greenfee",
    imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800",
    originalPrice: 5990,
    discountedPrice: 3995,
    timeRemaining: "72 timmar kvar",
    category: "Sport & Fritid",
  }
];

const deals = [
  {
    id: 1,
    title: "Lyxig Spa-dag",
    description: "Heldags spa-tillgång med 60 minuters massage och ansiktsbehandling",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
    originalPrice: 2000,
    discountedPrice: 990,
    timeRemaining: "2 dagar kvar",
    category: "Skönhet & Spa",
  },
  {
    id: 2,
    title: "3-rätters Gourmetmiddag",
    description: "Exklusiv matupplevelse på prisbelönt restaurang",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    originalPrice: 1500,
    discountedPrice: 750,
    timeRemaining: "3 dagar kvar",
    category: "Restauranger",
  },
  {
    id: 3,
    title: "Äventyrspark Heldagsbiljett",
    description: "Tillgång till alla attraktioner under en hel dag",
    imageUrl: "https://images.unsplash.com/photo-1536768139911-e290a59011e4?w=800",
    originalPrice: 800,
    discountedPrice: 450,
    timeRemaining: "5 dagar kvar",
    category: "Aktiviteter",
  },
  {
    id: 4,
    title: "Weekendpaket",
    description: "2 nätter på lyxhotell med frukost",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    originalPrice: 4000,
    discountedPrice: 2490,
    timeRemaining: "7 dagar kvar",
    category: "Resor",
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
