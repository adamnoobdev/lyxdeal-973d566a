import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DealCard } from "@/components/DealCard";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { Categories } from "@/components/Categories";
import { toast } from "sonner";

const featuredDeals = [
  {
    id: 1,
    title: "Premium Botox-behandling",
    description: "Omfattande behandling för panna, kråksparkar och glabellan med marknadsledande Botox",
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",
    originalPrice: 4990,
    discountedPrice: 2995,
    timeRemaining: "24 timmar kvar",
    category: "Rynkbehandlingar",
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
  }
];

const deals = [
  {
    id: 4,
    title: "Läppförstoring Premium",
    description: "Naturlig volym med Juvederm Volbella XC, inkl. konsultation och återbesök",
    imageUrl: "https://images.unsplash.com/photo-1588528402605-1f9d0eb7a6d6?w=800",
    originalPrice: 4990,
    discountedPrice: 2995,
    timeRemaining: "5 dagar kvar",
    category: "Fillers",
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
  },
  {
    id: 9,
    title: "Laserhårborttagning Ansikte",
    description: "3 behandlingar för hela ansiktet med Alexandrit-laser",
    imageUrl: "https://images.unsplash.com/photo-1598524374912-6b0b0bdd5e4e?w=800",
    originalPrice: 2990,
    discountedPrice: 1495,
    timeRemaining: "7 dagar kvar",
    category: "Laserhårborttagning",
  },
  {
    id: 10,
    title: "Anti-age Paket Plus",
    description: "Kombinationsbehandling med Botox och hyaluronsyra för optimal föryngring",
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",
    originalPrice: 7990,
    discountedPrice: 4995,
    timeRemaining: "3 dagar kvar",
    category: "Rynkbehandlingar",
  },
  {
    id: 11,
    title: "Keratinbehandling",
    description: "Intensiv hårvårdsbehandling för silkeslent och friskt hår i 3-4 månader",
    imageUrl: "https://images.unsplash.com/photo-1560869713-da86bd4f31b7?w=800",
    originalPrice: 2990,
    discountedPrice: 1795,
    timeRemaining: "5 dagar kvar",
    category: "Hårvård",
  },
  {
    id: 12,
    title: "Signatur Ansiktsbehandling",
    description: "2 timmars lyxig behandling med microdermabrasion och kollagenboost",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800",
    originalPrice: 2490,
    discountedPrice: 1245,
    timeRemaining: "4 dagar kvar",
    category: "Hudvård",
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
