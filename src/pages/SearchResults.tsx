
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DealsGrid } from "@/components/DealsGrid";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";
import { Deal } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "Alla Erbjudanden");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "Alla Städer");

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      const query = searchParams.get("q")?.toLowerCase() || "";
      const category = searchParams.get("category");
      const city = searchParams.get("city");

      let supabaseQuery = supabase
        .from("deals")
        .select("*")
        .eq("is_active", true) // Endast aktiva erbjudanden
        .eq("status", "approved") // Endast godkända erbjudanden
        .order("created_at", { ascending: false });

      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      if (category && category !== "Alla Erbjudanden") {
        supabaseQuery = supabaseQuery.eq("category", category);
      }

      if (city && city !== "Alla Städer") {
        supabaseQuery = supabaseQuery.eq("city", city);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error("Error fetching deals:", error);
        return;
      }

      setDeals(data as Deal[]);
      setIsLoading(false);
    };

    fetchDeals();
  }, [searchParams]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category !== "Alla Erbjudanden") {
      newParams.set("category", category);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    const newParams = new URLSearchParams(searchParams);
    if (city !== "Alla Städer") {
      newParams.set("city", city);
    } else {
      newParams.delete("city");
    }
    setSearchParams(newParams);
  };

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "Alla Erbjudanden";
  const city = searchParams.get("city") || "Alla Städer";
  
  const pageTitle = query 
    ? `${query} - Skönhetserbjudanden i ${city !== "Alla Städer" ? city : "Sverige"}`
    : `${category !== "Alla Erbjudanden" ? category : "Skönhetserbjudanden"} i ${city !== "Alla Städer" ? city : "Sverige"}`;
  
  const pageDescription = `Hitta de bästa ${category !== "Alla Erbjudanden" ? category.toLowerCase() : "skönhetserbjudandena"} i ${city !== "Alla Städer" ? city : "hela Sverige"}. Spara pengar på kvalitetsbehandlingar.`;

  // Bygg strukturerad data för sidan
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Hem",
        "item": "https://lyxdeal.se/"
      }
    ]
  };

  // Lägg till kategori i breadcrumbs om den finns
  if (category !== "Alla Erbjudanden") {
    breadcrumbData.itemListElement.push({
      "@type": "ListItem",
      "position": 2,
      "name": category,
      "item": `https://lyxdeal.se/search?category=${encodeURIComponent(category)}`
    });
  }

  // Lägg till stad i breadcrumbs om den finns
  if (city !== "Alla Städer") {
    breadcrumbData.itemListElement.push({
      "@type": "ListItem",
      "position": breadcrumbData.itemListElement.length + 1,
      "name": city,
      "item": `https://lyxdeal.se/search?city=${encodeURIComponent(city)}`
    });
  }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>{`${pageTitle} | Lyxdeal`}</title>
          <meta name="description" content={pageDescription} />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="container mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${pageTitle} | Lyxdeal`}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`https://lyxdeal.se/search?${searchParams.toString()}`} />
        
        <meta property="og:title" content={`${pageTitle} | Lyxdeal`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://lyxdeal.se/search?${searchParams.toString()}`} />
        
        {/* Breadcrumb strukturerad data */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
        
        {/* Produktlista strukturerad data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": pageTitle,
            "description": pageDescription,
            "numberOfItems": deals.length,
            "itemListElement": deals.slice(0, 10).map((deal, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "name": deal.title,
                "description": deal.description.substring(0, 200),
                "image": deal.imageUrl,
                "offers": {
                  "@type": "Offer",
                  "price": deal.discountedPrice,
                  "priceCurrency": "SEK",
                  "availability": "https://schema.org/InStock",
                  "url": `https://lyxdeal.se/deal/${deal.id}`
                }
              }
            }))
          })}
        </script>
      </Helmet>
    
      <div className="container mx-auto p-4 md:p-6">
        <div className="space-y-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till startsidan
            </Button>
          </Link>

          <Categories 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect} 
          />
          <Cities 
            selectedCity={selectedCity} 
            onSelectCity={handleCitySelect} 
          />
          
          <h1 className="text-2xl font-bold">
            {deals.length} erbjudanden hittades {city !== "Alla Städer" ? `i ${city}` : ""}
          </h1>
          
          <DealsGrid deals={deals} />
        </div>
      </div>
    </>
  );
}
