import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { NavigationBar } from "@/components/NavigationBar";
import { Footer } from "@/components/Footer";
import Index from "@/pages/Index";
import ProductDetails from "@/pages/ProductDetails";
import SearchResults from "@/pages/SearchResults";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import SalonLogin from "@/pages/SalonLogin";
import SalonDashboard from "@/pages/SalonDashboard";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <NavigationBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/deal/:id" element={<ProductDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/salon/login" element={<SalonLogin />} />
            <Route path="/salon/dashboard" element={<SalonDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Router>
  );
}

export default App;