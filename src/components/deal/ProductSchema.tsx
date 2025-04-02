
import { Helmet } from "react-helmet";
import { Deal } from "@/types/deal";

interface ProductSchemaProps {
  deal: Deal;
}

export const ProductSchema = ({ deal }: ProductSchemaProps) => {
  // Convert date to ISO format for schema
  const datePublished = new Date(deal.created_at).toISOString();
  
  // Calculate offer validity period
  const expiryDate = new Date(deal.expiration_date).toISOString();
  
  // Format salon name safely
  const salonName = deal.salons?.name || `Salong i ${deal.city}`;
  
  // JSON-LD structured data for Product
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": deal.title,
    "description": deal.description,
    "image": deal.image_url,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "SEK",
      "price": deal.discounted_price,
      "availability": "https://schema.org/InStock",
      "validFrom": datePublished,
      "validThrough": expiryDate,
      "seller": {
        "@type": "BeautySalon",
        "name": salonName
      },
      "priceValidUntil": expiryDate,
      "url": window.location.href,
      "hasMerchantReturnPolicy": false,
      "itemOffered": {
        "@type": "Service",
        "name": deal.title,
        "description": deal.description,
        "provider": {
          "@type": "BeautySalon",
          "name": salonName,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": deal.city,
            "addressCountry": "SE"
          }
        }
      }
    }
  };

  // Service schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": deal.title,
    "description": deal.description,
    "provider": {
      "@type": "BeautySalon",
      "name": salonName,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": deal.city,
        "addressCountry": "SE"
      }
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "SEK",
      "price": deal.discounted_price,
      "eligibleRegion": {
        "@type": "Country",
        "name": "SE"
      }
    }
  };

  return (
    <Helmet>
      <title>{deal.title} | {deal.city} | Lyxdeal</title>
      <meta name="description" content={`${deal.title} - ${deal.description.substring(0, 120)}...`} />
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};
