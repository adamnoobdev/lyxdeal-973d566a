
import { useSearchParams } from "react-router-dom";
import { useSearchResults } from "@/hooks/useSearchResults";
import { SearchResultsContent } from "@/components/search/SearchResultsContent";
import { SearchLoadingState } from "@/components/search/SearchLoadingState";
import { PageMetadata } from "@/components/seo/PageMetadata";
import { SearchStructuredData } from "@/components/search/SearchStructuredData";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    deals,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    selectedCity,
    setSelectedCity
  } = useSearchResults(searchParams);

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

  // Build canonical path
  const canonicalParams = new URLSearchParams();
  if (query) canonicalParams.set('q', query);
  if (category !== "Alla Erbjudanden") canonicalParams.set('category', category);
  if (city !== "Alla Städer") canonicalParams.set('city', city);
  
  const paramString = canonicalParams.toString();
  const canonicalPath = `/search${paramString ? `?${paramString}` : ''}`;

  if (isLoading) {
    return (
      <>
        <PageMetadata
          title={pageTitle}
          description={pageDescription}
          canonicalPath={canonicalPath}
        />
        <SearchLoadingState 
          pageTitle={pageTitle}
          pageDescription={pageDescription}
        />
      </>
    );
  }

  // Create structured data for search results
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Hem",
          "item": "https://lyxdeal.se/"
        },
        ...(category !== "Alla Erbjudanden" ? [{
          "@type": "ListItem",
          "position": 2,
          "name": category,
          "item": `https://lyxdeal.se/search?category=${encodeURIComponent(category)}`
        }] : []),
        ...(city !== "Alla Städer" ? [{
          "@type": "ListItem",
          "position": category !== "Alla Erbjudanden" ? 3 : 2,
          "name": city,
          "item": `https://lyxdeal.se/search?city=${encodeURIComponent(city)}`
        }] : [])
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": pageTitle,
      "description": pageDescription,
      "numberOfItems": deals?.length || 0,
      "itemListElement": deals?.slice(0, 10).map((deal, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": deal.title,
          "description": deal.description.substring(0, 150) + "...",
          "offers": {
            "@type": "Offer",
            "price": deal.discounted_price,
            "priceCurrency": "SEK"
          },
          "url": `https://lyxdeal.se/deal/${deal.id}`
        }
      })) || []
    }
  ];

  return (
    <>
      <PageMetadata
        title={pageTitle}
        description={pageDescription}
        canonicalPath={canonicalPath}
        structuredData={structuredData}
      />
      <SearchResultsContent
        deals={deals}
        query={query}
        category={category}
        city={city}
        selectedCategory={selectedCategory}
        selectedCity={selectedCity}
        searchParams={searchParams}
        onCategorySelect={handleCategorySelect}
        onCitySelect={handleCitySelect}
      />
    </>
  );
}
