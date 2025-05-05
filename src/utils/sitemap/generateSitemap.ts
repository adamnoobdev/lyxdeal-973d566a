
import { CITIES, CATEGORIES } from "@/constants/app-constants";

/**
 * Generates dynamic URLs for the sitemap based on application data
 */
export const generateDynamicUrls = async () => {
  try {
    // These would be fetched from the database in a production scenario
    // For now, we're generating predictable paths based on existing categories and cities
    
    // Generate city + category combinations
    const locationCategoryUrls = CITIES
      .filter(city => city !== "Alla Städer")
      .flatMap(city => 
        CATEGORIES
          .filter(category => category !== "Alla Erbjudanden")
          .map(category => `/search?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`)
      );
    
    // Generate city URLs
    const cityUrls = CITIES
      .filter(city => city !== "Alla Städer")
      .map(city => `/search?city=${encodeURIComponent(city)}`);
    
    // Generate category URLs
    const categoryUrls = CATEGORIES
      .filter(category => category !== "Alla Erbjudanden")
      .map(category => `/search?category=${encodeURIComponent(category)}`);
    
    // Combine all dynamic URLs
    return [...locationCategoryUrls, ...cityUrls, ...categoryUrls];
  } catch (error) {
    console.error("Error generating dynamic URLs for sitemap:", error);
    return [];
  }
};

/**
 * Generates the XML sitemap content
 */
export const generateSitemapXml = (staticUrls: string[], dynamicUrls: string[]) => {
  const baseUrl = 'https://lyxdeal.se';
  const today = new Date().toISOString().split('T')[0];
  
  const urlEntries = [...staticUrls, ...dynamicUrls]
    .map(url => {
      // Determine the priority and change frequency based on the URL
      const isHomePage = url === '/';
      const isStaticPage = staticUrls.includes(url);
      const priority = isHomePage ? '1.0' : isStaticPage ? '0.8' : '0.6';
      const changefreq = isHomePage ? 'daily' : isStaticPage ? 'weekly' : 'monthly';
      
      return `
        <url>
          <loc>${baseUrl}${url}</loc>
          <lastmod>${today}</lastmod>
          <changefreq>${changefreq}</changefreq>
          <priority>${priority}</priority>
        </url>
      `;
    })
    .join('');
    
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries}
</urlset>`;
};

/**
 * List of static URLs for the sitemap
 */
export const staticUrls = [
  '/',
  '/search',
  '/faq',
  '/terms',
  '/privacy',
  '/partner',
  '/creator',
];
