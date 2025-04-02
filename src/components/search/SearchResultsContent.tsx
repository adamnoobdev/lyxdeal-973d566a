
import { Link } from "react-router-dom";
import { Deal } from "@/types/deal";
import { Categories } from "@/components/Categories";
import { Cities } from "@/components/Cities";
import { DealsGrid } from "@/components/DealsGrid";
import { Helmet } from "react-helmet";
import { SearchStructuredData } from "./SearchStructuredData";
import { SearchBreadcrumbs } from "./SearchBreadcrumbs";
import { SearchPageTitle } from "./SearchPageTitle";

interface SearchResultsContentProps {
  deals: Deal[];
  query: string;
  category: string;
  city: string;
  selectedCategory: string;
  selectedCity: string;
  searchParams: URLSearchParams;
  onCategorySelect: (category: string) => void;
  onCitySelect: (city: string) => void;
}

export const SearchResultsContent = ({
  deals,
  query,
  category,
  city,
  selectedCategory,
  selectedCity,
  searchParams,
  onCategorySelect,
  onCitySelect,
}: SearchResultsContentProps) => {
  const pageTitle = query 
    ? `${query} - Skönhetserbjudanden i ${city !== "Alla Städer" ? city : "Sverige"}`
    : `${category !== "Alla Erbjudanden" ? category : "Skönhetserbjudanden"} i ${city !== "Alla Städer" ? city : "Sverige"}`;
  
  const pageDescription = `Hitta de bästa ${category !== "Alla Erbjudanden" ? category.toLowerCase() : "skönhetserbjudandena"} i ${city !== "Alla Städer" ? city : "hela Sverige"}. Spara pengar på kvalitetsbehandlingar.`;

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
      </Helmet>
      
      {/* Structured Data Component */}
      <SearchStructuredData 
        deals={deals}
        query={query}
        category={category}
        city={city}
        searchParams={searchParams}
      />
    
      {/* Breadcrumb navigation */}
      <SearchBreadcrumbs 
        query={query}
        category={category}
        city={city}
      />
      
      <div className="container mx-auto p-4 md:p-6 flex flex-col items-center">
        <div className="space-y-6 max-w-5xl w-full">
          <SearchPageTitle
            deals={deals}
            query={query}
            category={category}
            city={city}
          />

          <div className="w-full space-y-4">
            <Cities
              selectedCity={selectedCity}
              onSelectCity={onCitySelect}
              selectedCategory={selectedCategory}
            />
            
            <Categories 
              selectedCategory={selectedCategory} 
              onSelectCategory={onCategorySelect} 
            />
          </div>
          
          <DealsGrid deals={deals} />
        </div>
      </div>
    </>
  );
};
