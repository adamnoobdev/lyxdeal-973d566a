
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

interface PageMetadataProps {
  title: string;
  description: string;
  imageUrl?: string;
  structuredData?: Record<string, any>[];
  canonicalPath?: string;
  children?: React.ReactNode;
}

/**
 * Component for managing page metadata across the application
 * Improves SEO by providing consistent metadata structure
 */
export const PageMetadata = ({
  title,
  description,
  imageUrl = "https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets/24x-mini-icon.png",
  structuredData = [],
  canonicalPath,
  children
}: PageMetadataProps) => {
  const location = useLocation();
  const currentUrl = window.location.origin + (canonicalPath || location.pathname);
  
  // Base domain for canonical URLs
  const baseDomain = "https://lyxdeal.se";
  const canonicalUrl = canonicalPath 
    ? `${baseDomain}${canonicalPath}` 
    : `${baseDomain}${location.pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Social Media Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Structured Data JSON-LD */}
      {structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}

      {/* Any additional SEO elements */}
      {children}
    </Helmet>
  );
};
