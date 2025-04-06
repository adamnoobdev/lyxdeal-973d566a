
import { DealsGrid } from "@/components/DealsGrid";
import { SearchBreadcrumbs } from "@/components/search/SearchBreadcrumbs";
import { SearchPageTitle } from "@/components/search/SearchPageTitle";
import { SearchStructuredData } from "@/components/search/SearchStructuredData";
import { CategoryFilter } from "@/components/search/filters/CategoryFilter";
import { CityFilter } from "@/components/search/filters/CityFilter";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
  const isMobile = useIsMobile();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
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

  const FiltersSection = () => (
    <>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />
      <CityFilter
        selectedCity={selectedCity}
        onCitySelect={onCitySelect}
      />
    </>
  );

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
        
        {/* Mobile filter button */}
        {isMobile && (
          <div className="mb-4 mt-2">
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtrera
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-[300px] p-4">
                <SheetHeader className="mb-4">
                  <SheetTitle>Filtrera erbjudanden</SheetTitle>
                </SheetHeader>
                <div className="space-y-4">
                  <FiltersSection />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          {/* Desktop Filters Section */}
          {!isMobile && (
            <div className="w-full md:w-52 flex-shrink-0">
              <FiltersSection />
            </div>
          )}
          
          {/* Results Section */}
          <div className="flex-grow">
            <div className="flex flex-col space-y-4">
              <h1 className="text-lg xs:text-xl font-bold text-primary">
                {getHeaderText(query, category, city)}
              </h1>
              
              {deals && deals.length > 0 ? (
                <DealsGrid deals={deals} compact={true} />
              ) : (
                <div className="p-4 xs:p-6 border border-muted rounded-lg bg-white/50 text-center">
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
