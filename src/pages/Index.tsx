import { useState } from "react";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";
import { DealsGrid } from "@/components/DealsGrid";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Sparkles, Star, QrCode, Percent } from "lucide-react";
import { CATEGORIES } from "@/constants/app-constants";
import { useDeals } from "@/hooks/useDeals";

export default function IndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState<string>("Alla Städer");

  const { data: deals, isLoading } = useDeals(selectedCategory, selectedCity);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent min-h-[500px] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
              Upptäck Skönhet & Välbefinnande
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Exklusiva erbjudanden från Sveriges bästa salonger
            </p>
          </div>
          
          {/* Category Badges */}
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {CATEGORIES.filter(cat => cat !== "Alla Erbjudanden").map((category) => (
              <CategoryBadge 
                key={category}
                category={category}
                variant="default"
                className="cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 space-y-12">
        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Percent, 
              title: "Upp till 70%", 
              description: "Rabatt på behandlingar" 
            },
            { 
              icon: QrCode, 
              title: "Digital kod", 
              description: "Använd direkt i salongen" 
            },
            { 
              icon: Star, 
              title: "Kvalitetssäkrat", 
              description: "Utvalda salonger" 
            }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-accent/50 rounded-xl p-6 text-center transition-all duration-300 hover:bg-accent hover:shadow-lg"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <stat.icon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-primary">{stat.title}</h3>
              <p className="text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Categories and Cities */}
        <div className="space-y-8">
          <Categories 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <Cities 
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
          />
        </div>

        {/* Featured Deals */}
        <section className="space-y-8">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Utvalda erbjudanden</h2>
          </div>
          <FeaturedDeals />
        </section>

        {/* All Deals */}
        <section className="space-y-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Alla erbjudanden</h2>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-accent/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            deals && <DealsGrid deals={deals} />
          )}
        </section>
      </main>
    </div>
  );
}