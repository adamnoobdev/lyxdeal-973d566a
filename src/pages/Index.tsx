import { useState } from "react";
import { DealCard } from "@/components/DealCard";
import { Categories } from "@/components/Categories";

// Mock data for initial development
const deals = [
  {
    id: 1,
    title: "Luxury Spa Day Experience",
    description: "Full day spa access with 60-minute massage and facial treatment",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
    originalPrice: 200,
    discountedPrice: 99,
    timeRemaining: "2 days left",
    category: "Beauty & Spa",
  },
  {
    id: 2,
    title: "Gourmet 3-Course Dinner",
    description: "Fine dining experience at award-winning restaurant",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    originalPrice: 150,
    discountedPrice: 75,
    timeRemaining: "3 days left",
    category: "Restaurants",
  },
  {
    id: 3,
    title: "Adventure Park Full Day Pass",
    description: "Access to all rides and attractions for one full day",
    imageUrl: "https://images.unsplash.com/photo-1536768139911-e290a59011e4?w=800",
    originalPrice: 80,
    discountedPrice: 45,
    timeRemaining: "5 days left",
    category: "Activities",
  },
  {
    id: 4,
    title: "Weekend Getaway Package",
    description: "2 nights stay at luxury resort with breakfast included",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    originalPrice: 400,
    discountedPrice: 249,
    timeRemaining: "7 days left",
    category: "Travel",
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Deals");

  const filteredDeals = selectedCategory === "All Deals"
    ? deals
    : deals.filter(deal => deal.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-gray-900">Hot Deals</h1>
          <p className="mt-2 text-gray-600">Discover amazing offers and save big!</p>
        </div>
      </header>

      <main className="container py-8">
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
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

export default Index;