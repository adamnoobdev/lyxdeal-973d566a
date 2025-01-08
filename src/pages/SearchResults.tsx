import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DealCard } from "@/components/DealCard";
import { Categories } from "@/components/Categories";

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

const navigationItems = [
  {
    title: "Kategorier",
    items: [
      { title: "Skönhet & Spa", href: "#" },
      { title: "Restauranger", href: "#" },
      { title: "Aktiviteter", href: "#" },
      { title: "Resor", href: "#" },
    ],
  },
  {
    title: "Populära",
    items: [
      { title: "Veckans Deals", href: "#" },
      { title: "Mest Sålda", href: "#" },
      { title: "Nya Erbjudanden", href: "#" },
    ],
  },
  {
    title: "Om Oss",
    items: [
      { title: "Kontakta Oss", href: "#" },
      { title: "Kundservice", href: "#" },
      { title: "Villkor", href: "#" },
    ],
  },
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const category = searchParams.get("category") || "Alla Erbjudanden";
  const [selectedCategory, setSelectedCategory] = useState(category);

  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  const filteredDeals = deals.filter((deal) => {
    const matchesCategory =
      selectedCategory === "Alla Erbjudanden" || deal.category === selectedCategory;
    const matchesSearch = searchQuery
      ? deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery
              ? `Sökresultat för "${searchQuery}"`
              : `${selectedCategory}`}
          </h1>
          <p className="text-gray-600">
            {filteredDeals.length} erbjudanden hittades
          </p>
        </div>

        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            const params = new URLSearchParams(searchParams);
            params.set("category", category);
            window.history.pushState({}, "", `?${params.toString()}`);
            setSelectedCategory(category);
          }}
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
