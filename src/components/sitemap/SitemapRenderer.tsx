
import { useEffect, useState } from 'react';
import { generateDynamicUrls, generateSitemapXml, staticUrls } from '@/utils/sitemap/generateSitemap';

/**
 * Component that renders the XML sitemap when accessed at /sitemap.xml
 */
export const SitemapRenderer = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const dynamicUrls = await generateDynamicUrls();
        const sitemap = generateSitemapXml(staticUrls, dynamicUrls);
        setSitemapContent(sitemap);
      } catch (error) {
        console.error('Error generating sitemap:', error);
        setSitemapContent('<!-- Error generating sitemap -->');
      }
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    if (sitemapContent) {
      // Create a Blob with the XML content
      const blob = new Blob([sitemapContent], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      
      // Set up download attributes
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sitemap.xml';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [sitemapContent]);

  return (
    <div style={{ display: 'none' }}>
      {sitemapContent ? 'Sitemap generated' : 'Generating sitemap...'}
    </div>
  );
};
