
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

// Add preloading for critical resources if needed
const preloadCriticalResources = () => {
  const resources = [
    // Add critical stylesheets or resources here
    { href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap", as: "style" },
  ];
  
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.as === 'style') {
      link.onload = () => { link.rel = 'stylesheet'; };
    }
    document.head.appendChild(link);
  });
};

// Preload resources first
preloadCriticalResources();

// Start the app
startApp();
