
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Configure query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      // Enable SSR prefetching
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
})

// Initialize the app with hydration
const startApp = () => {
  const container = document.getElementById("root");
  if (!container) throw new Error("Root element not found");
  
  // Create root with react 18's createRoot
  const root = createRoot(container);
  root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

// Add preloading for critical resources
const preloadCriticalResources = () => {
  const resources = [
    { href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap", as: "style" },
    // Add other critical resources as needed
  ];
  
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    link.crossOrigin = "anonymous";
    
    if (resource.as === 'style') {
      link.onload = () => { link.rel = 'stylesheet'; };
    }
    document.head.appendChild(link);
  });
  
  // Set viewport and other important meta tags
  const metaTags = [
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { name: "theme-color", content: "#ffffff" }
  ];
  
  metaTags.forEach(meta => {
    const metaTag = document.createElement('meta');
    metaTag.name = meta.name;
    metaTag.content = meta.content;
    document.head.appendChild(metaTag);
  });
};

// First, preload critical resources
preloadCriticalResources();

// Then start the application
startApp();
