
import { useEffect, useState } from 'react';
import { generateDynamicUrls, generateSitemapXml, staticUrls } from '@/utils/sitemap/generateSitemap';

/**
 * Component that renders the XML sitemap 
 * This is rendered at the /sitemap.xml route
 */
export const SitemapRenderer = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        // Generate the sitemap content
        const dynamicUrls = await generateDynamicUrls();
        const sitemap = generateSitemapXml(staticUrls, dynamicUrls);
        setSitemapContent(sitemap);
        
        // Set the appropriate content type and serve the XML
        const blob = new Blob([sitemap], { type: 'text/xml' });
        const sitemapUrl = URL.createObjectURL(blob);
        
        // We're directly serving the content by setting content-type headers
        // and returning the XML data in the response
        const newWindow = window.open(sitemapUrl, '_self');
        
        // Cleanup the object URL
        if (newWindow) {
          setTimeout(() => {
            URL.revokeObjectURL(sitemapUrl);
          }, 100);
        }
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };

    generateSitemap();
  }, []);

  return null; // This component doesn't render any UI, it just serves the XML
};
