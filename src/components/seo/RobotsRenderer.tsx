
import { useEffect } from 'react';

/**
 * Component that renders a dynamic robots.txt file
 */
export const RobotsRenderer = () => {
  useEffect(() => {
    const robotsContent = `# Allow all web crawlers
User-agent: *
Allow: /

# Disallow admin section
Disallow: /admin/
Disallow: /salon/dashboard/
Disallow: /salon/login/
Disallow: /update-password/
Disallow: /salon/update-password/

# Sitemap location
Sitemap: https://lyxdeal.se/sitemap.xml
`;

    // Create a blob and download
    const blob = new Blob([robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div style={{ display: 'none' }}>
      Generating robots.txt
    </div>
  );
};
