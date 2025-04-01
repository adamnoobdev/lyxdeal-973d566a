
import { Deal } from "@/types/deal";

interface SearchStructuredDataProps {
  deals: Deal[];
  query: string;
  category: string;
  city: string;
  searchParams: URLSearchParams;
}

export const SearchStructuredData = ({
  deals,
  query,
  category,
  city,
  searchParams,
}: SearchStructuredDataProps) => {
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

  return (
    <>
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
              "image": deal.image_url,
              "offers": {
                "@type": "Offer",
                "price": deal.discounted_price,
                "priceCurrency": "SEK",
                "availability": "https://schema.org/InStock",
                "url": `https://lyxdeal.se/deal/${deal.id}`
              }
            }
          }))
        })}
      </script>
    </>
  );
};
