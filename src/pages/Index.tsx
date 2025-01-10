import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";
import { DealsGrid } from "@/components/DealsGrid";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { SearchBar } from "@/components/SearchBar";
import { Deal } from "@/types/deal";
import { Sparkles, Star } from "lucide-react";

export default function IndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: deals, isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Deal[];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470259078422-826894b933aa?q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Upptäck dagens bästa erbjudanden</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Hitta ditt nästa fantastiska skönhetserbjudande
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Utforska hundratals exklusiva erbjudanden från de bästa salongerna i din stad
            </p>
            <div className="pt-4">
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSubmit={handleSearch}
                className="max-w-xl bg-white/10 backdrop-blur-md border-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 space-y-12">
        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Star, title: "4.8/5", description: "Genomsnittligt betyg" },
            { icon: Sparkles, title: "10,000+", description: "Nöjda kunder" },
            { icon: Star, title: "500+", description: "Partnersalonger" }
          ].map((stat, index) => (
            <div key={index} className="bg-accent/50 rounded-xl p-6 text-center transition-all duration-300 hover:bg-accent">
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