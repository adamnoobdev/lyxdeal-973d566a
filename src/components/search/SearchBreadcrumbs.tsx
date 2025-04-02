
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
    <div className="w-full bg-gray-50/80 py-4 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <Breadcrumb>
            <BreadcrumbList className="text-xs md:text-sm text-gray-600">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-primary font-medium hover:text-primary/80 transition-colors">
                    lyxdeal.se
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              
              <BreadcrumbSeparator>
                <ChevronRight className="h-3 w-3 text-gray-400" />
              </BreadcrumbSeparator>
              
              {city !== "Alla Städer" && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link 
                        to={`/search?city=${encodeURIComponent(city)}`}
                        className="text-primary/90 hover:text-primary transition-colors"
                      >
                        {city}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                  </BreadcrumbSeparator>
                </>
              )}
              
              {category !== "Alla Erbjudanden" && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link 
                        to={`/search?category=${encodeURIComponent(category)}`}
                        className="text-primary/90 hover:text-primary transition-colors"
                      >
                        {category}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                  </BreadcrumbSeparator>
                </>
              )}
              
              {query && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">{query}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
              
              {!query && !category && !city && (
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">Alla erbjudanden</BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
};
