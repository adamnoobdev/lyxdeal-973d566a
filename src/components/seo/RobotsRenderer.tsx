
import { useEffect } from 'react';

/**
 * Component that renders a dynamic robots.txt file
 * This is rendered at the /robots.txt route
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

    try {
      // Create a blob with the robots.txt content
      const blob = new Blob([robotsContent], { type: 'text/plain' });
      const robotsUrl = URL.createObjectURL(blob);
      
      // Open the robots.txt content directly in the current window
      const newWindow = window.open(robotsUrl, '_self');
      
      // Cleanup
      if (newWindow) {
        setTimeout(() => {
          URL.revokeObjectURL(robotsUrl);
        }, 100);
      }
    } catch (error) {
      console.error("Error rendering robots.txt:", error);
      document.body.innerHTML = `<pre>${robotsContent}</pre>`;
    }
  }, []);

  return null; // This component doesn't render any UI, it just serves the robots.txt content
};
