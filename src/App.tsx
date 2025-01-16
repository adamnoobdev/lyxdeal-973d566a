import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { NavigationBar } from "@/components/NavigationBar";
import { Footer } from "@/components/Footer";

// Lazy load routes
const Index = lazy(() => import("@/pages/Index"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const SearchResults = lazy(() => import("@/pages/SearchResults"));
const Auth = lazy(() => import("@/pages/Auth"));
const Admin = lazy(() => import("@/pages/Admin"));
const SalonDashboard = lazy(() => import("@/pages/SalonDashboard"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Terms = lazy(() => import("@/pages/Terms"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <NavigationBar />
        <main className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/deal/:id" element={<ProductDetails />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/salon/dashboard" element={<SalonDashboard />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Router>
  );
}

export default App;