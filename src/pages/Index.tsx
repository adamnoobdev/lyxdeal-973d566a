import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DealCard } from "@/components/DealCard";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { Categories } from "@/components/Categories";
import { toast } from "sonner";

const featuredDeals = [
  {
    id: 5,
    title: "Komplett Ansiktsbehandling",
    description: "Lyxig ansiktsbehandling med djuprengöring, peeling och mask för strålande hy",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",
    originalPrice: 1990,
    discountedPrice: 990,
    timeRemaining: "48 timmar kvar",
    category: "Hudvård",
  },
  {
    id: 6,
    title: "Permanent Hårborttagning",
    description: "6 behandlingar med senaste laserteknologin för långvarigt resultat",
    imageUrl: "https://images.unsplash.com/photo-1598524374912-6b0b0bdd5e4e?w=800",
    originalPrice: 9990,
    discountedPrice: 4990,
    timeRemaining: "24 timmar kvar",
    category: "Laserhårborttagning",
  },
  {
    id: 7,
    title: "Lyxigt Hårvårdspaket",
    description: "Klippning, färgning och keratinbehandling för glänsande resultat",
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
    title: "Läppförstoring med Filler",
    description: "Naturlig volym med premium hyaluronsyra från marknadsledande märke",
    imageUrl: "https://images.unsplash.com/photo-1588528402605-1f9d0eb7a6d6?w=800",
    originalPrice: 4000,
    discountedPrice: 2490,
    timeRemaining: "2 dagar kvar",
    category: "Fillers",
  },
  {
    id: 2,
    title: "Anti-age Behandlingspaket",
    description: "Botox för reducering av rynkor i panna och kring ögon",
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",
    originalPrice: 3500,
    discountedPrice: 1990,
    timeRemaining: "3 dagar kvar",
    category: "Rynkbehandlingar",
  },
  {
    id: 3,
    title: "Lyxig Manikyr",
    description: "Omfattande nagelvård med gellack och handmassage",
    imageUrl: "https://images.unsplash.com/photo-1610992015732-2449b0dd2b8f?w=800",
    originalPrice: 800,
    discountedPrice: 450,
    timeRemaining: "5 dagar kvar",
    category: "Naglar",
  },
  {
    id: 4,
    title: "Avkopplande Massage",
    description: "90 minuters helkroppsmassage med aromaterapi",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
    originalPrice: 1200,
    discountedPrice: 790,
    timeRemaining: "7 dagar kvar",
    category: "Massage",
  },
  {
    id: 8,
    title: "Ansiktsbehandling med AHA",
    description: "Kemisk peeling för förnyad och fräsch hy",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",
    originalPrice: 1500,
    discountedPrice: 899,
    timeRemaining: "4 dagar kvar",
    category: "Hudvård",
  },
  {
    id: 9,
    title: "Laserhårborttagning Ben",
    description: "Helben behandling med modern diodlaser",
    imageUrl: "https://images.unsplash.com/photo-1598524374912-6b0b0bdd5e4e?w=800",
    originalPrice: 3990,
    discountedPrice: 2490,
    timeRemaining: "6 dagar kvar",
    category: "Laserhårborttagning",
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Alla Erbjudanden");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (query: string) => {
    try {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error("Sökfel:", error);
      toast.error("Ett fel uppstod vid sökningen. Försök igen.");
    }
  };

  const handleCategorySelect = (category: string) => {
    try {
      setIsLoading(true);
      setSelectedCategory(category);
      if (category !== "Alla Erbjudanden") {
        navigate(`/search?category=${encodeURIComponent(category)}`);
      }
    } catch (error) {
      console.error("Kategorifel:", error);
      toast.error("Ett fel uppstod vid val av kategori. Försök igen.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDealClick = (dealId: number) => {
    try {
      navigate(`/product/${dealId}`);
    } catch (error) {
      console.error("Navigeringsfel:", error);
      toast.error("Ett fel uppstod. Försök igen.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="relative mb-8">
          <FeaturedDeals deals={featuredDeals} />
        </div>

        <Categories 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect} 
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {deals.map((deal) => (
            <div key={deal.id} onClick={() => handleDealClick(deal.id)}>
              <DealCard {...deal} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;