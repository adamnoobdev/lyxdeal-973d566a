
import React from "react";
import { Helmet } from "react-helmet";
import { Deal } from "@/types/deal";

interface ProductSchemaProps {
  deal: Deal;
}

export const ProductSchema = ({ deal }: ProductSchemaProps) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": deal.title,
    "description": deal.description,
    "image": deal.imageUrl,
    "offers": {
      "@type": "Offer",
      "price": deal.discountedPrice,
      "priceCurrency": "SEK",
      "url": `https://lyxdeal.se/deal/${deal.id}`,
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(Date.now() + deal.daysRemaining * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "seller": {
        "@type": "Organization",
        "name": deal.salon?.name || `Salong i ${deal.city}`
      }
    }
  };

  return (
    <Helmet>
      <title>{`${deal.title} - ${deal.salon?.name || deal.city} | Lyxdeal`}</title>
      <meta name="description" content={`${deal.description.split('\n')[0].substring(0, 150)}... Spara ${deal.originalPrice - deal.discountedPrice} kr på detta erbjudande från ${deal.salon?.name || `salon i ${deal.city}`}.`} />
      <link rel="canonical" href={`https://lyxdeal.se/deal/${deal.id}`} />
      
      <meta property="og:title" content={`${deal.title} - ${deal.salon?.name || deal.city}`} />
      <meta property="og:description" content={`${deal.description.split('\n')[0].substring(0, 150)}... Spara ${deal.originalPrice - deal.discountedPrice} kr.`} />
      <meta property="og:image" content={deal.imageUrl} />
      <meta property="og:type" content="product" />
      <meta property="og:url" content={`https://lyxdeal.se/deal/${deal.id}`} />
      <meta property="product:price:amount" content={`${deal.discountedPrice}`} />
      <meta property="product:price:currency" content="SEK" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${deal.title} - ${deal.salon?.name || deal.city}`} />
      <meta name="twitter:description" content={`${deal.description.split('\n')[0].substring(0, 150)}... Spara ${deal.originalPrice - deal.discountedPrice} kr.`} />
      <meta name="twitter:image" content={deal.imageUrl} />
      
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};
