
import { Helmet } from "react-helmet";
import { Deal } from "@/types/deal";
import { FormattedDealData } from "@/utils/deal/types";

interface ProductSchemaProps {
  deal: Deal | FormattedDealData;
}

export const ProductSchema = ({ deal }: ProductSchemaProps) => {
  // Convert date to ISO format for schema
  const datePublished = new Date(deal.created_at).toISOString();
  
  // Calculate offer validity period
  const expiryDate = 'expiration_date' in deal 
    ? new Date(deal.expiration_date).toISOString()
    : new Date(deal.expirationDate).toISOString();
  
  // Format salon name safely
  const salonName = 'salons' in deal && deal.salons?.name 
    ? deal.salons.name 
    : deal.salon?.name || `Salong i ${deal.city}`;
  
  // Get image URL based on type
  const imageUrl = 'image_url' in deal ? deal.image_url : deal.imageUrl;
  
  // Get prices based on type
  const originalPrice = 'original_price' in deal ? deal.original_price : deal.originalPrice;
  const discountedPrice = 'discounted_price' in deal ? deal.discounted_price : deal.discountedPrice;
  
  // JSON-LD structured data for Product
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": deal.title,
    "description": deal.description,
    "image": imageUrl,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "SEK",
      "price": discountedPrice,
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
      "price": discountedPrice,
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
