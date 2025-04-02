
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

interface SearchBreadcrumbsProps {
  query: string;
  category: string;
  city: string;
}

export const SearchBreadcrumbs = ({
  query,
  category,
  city,
}: SearchBreadcrumbsProps) => {
  // Create breadcrumb label based on search parameters
  const getPageTitle = () => {
    if (query) {
      return `Sökning: ${query}`;
    } else if (category !== "Alla Erbjudanden" && city !== "Alla Städer") {
      return `${category} i ${city}`;
    } else if (category !== "Alla Erbjudanden") {
      return category;
    } else if (city !== "Alla Städer") {
      return city;
    } else {
      return "Alla erbjudanden";
    }
  };

  return (
    <div className="w-full bg-gray-50 py-3 border-b">
      <div className="container mx-auto px-4 flex justify-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">lyxdeal.se</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            
            {city !== "Alla Städer" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/search?city=${encodeURIComponent(city)}`}>
                      {city}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              </>
            )}
            
            {category !== "Alla Erbjudanden" && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/search?category=${encodeURIComponent(category)}`}>
                      {category}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              </>
            )}
            
            {query && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage>{query}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
            
            {!query && !category && !city && (
              <BreadcrumbItem>
                <BreadcrumbPage>Alla erbjudanden</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};
