
import { Helmet } from "react-helmet";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SearchLoadingStateProps {
  pageTitle: string;
  pageDescription: string;
}

export const SearchLoadingState = ({
  pageTitle,
  pageDescription,
}: SearchLoadingStateProps) => {
  return (
    <>
      <Helmet>
        <title>{`${pageTitle} | Lyxdeal`}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      {/* Loading breadcrumb */}
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
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <Skeleton className="h-4 w-24" />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <div className="my-6 text-center">
            <Skeleton className="h-10 w-2/3 mb-2 mx-auto" />
            <Skeleton className="h-5 w-full max-w-lg mb-4 mx-auto" />
            <Skeleton className="h-4 w-40 mt-2 mx-auto" />
          </div>

          {/* Categories placeholder */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Deals grid placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Skeleton className="h-48 w-full mb-3 rounded-lg" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
