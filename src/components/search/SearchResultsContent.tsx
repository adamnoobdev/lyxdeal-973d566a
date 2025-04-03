import { DealsGrid } from "@/components/DealsGrid";
import { SearchBreadcrumbs } from "@/components/search/SearchBreadcrumbs";
import { SearchPageTitle } from "@/components/search/SearchPageTitle";
import { SearchStructuredData } from "@/components/search/SearchStructuredData";
import { CategoryFilter } from "@/components/search/filters/CategoryFilter";
import { CityFilter } from "@/components/search/filters/CityFilter";

export function SearchResultsContent({
  deals,
  query,
  category,
  city,
  selectedCategory,
  selectedCity,
  searchParams,
  onCategorySelect,
  onCitySelect
}) {
  const getHeaderText = (query, category, city) => {
    if (query) {
      return `Sökresultat för "${query}" i ${city}`;
    }
    return `${category} i ${city}`;
  };

  const pageTitle = query
    ? `${query} - Skönhetserbjudanden i ${city !== "Alla Städer" ? city : "Sverige"}`
    : `${category !== "Alla Erbjudanden" ? category : "Skönhetserbjudanden"} i ${city !== "Alla Städer" ? city : "Sverige"}`;

  const pageDescription = `Hitta de bästa ${category !== "Alla Erbjudanden" ? category.toLowerCase() : "skönhetserbjudandena"} i ${city !== "Alla Städer" ? city : "hela Sverige"}. Spara pengar på kvalitetsbehandlingar.`;

  return (
    <>
      <SearchPageTitle 
        title={pageTitle}
        description={pageDescription}
      />
      
      <SearchStructuredData 
        query={query}
        city={city}
        category={category}
        resultCount={deals?.length || 0}
      />
      
      <div className="container mx-auto px-4 py-6 mb-8">
        <SearchBreadcrumbs query={query} category={category} city={city} />
        
        <div className="mt-4 flex flex-col md:flex-row gap-6">
          {/* Filters Section */}
          <div className="w-full md:w-64 flex-shrink-0">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategorySelect={onCategorySelect}
            />
            <CityFilter
              selectedCity={selectedCity}
              onCitySelect={onCitySelect}
            />
          </div>
          
          {/* Results Section */}
          <div className="flex-grow">
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-bold text-primary">
                {getHeaderText(query, category, city)}
              </h1>
              
              {deals && deals.length > 0 ? (
                <DealsGrid deals={deals} />
              ) : (
                <div className="p-6 border border-muted rounded-lg bg-white/50 text-center">
                  <p className="text-muted-foreground">Inga erbjudanden hittades för din sökning.</p>
                  <p className="text-sm text-muted-foreground mt-2">Prova att ändra dina sökfilter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
