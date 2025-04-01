
import { Helmet } from "react-helmet";

interface SearchLoadingStateProps {
  pageTitle: string;
  pageDescription: string;
}

export const SearchLoadingState = ({ pageTitle, pageDescription }: SearchLoadingStateProps) => {
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
};
