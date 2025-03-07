import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProductDetails from "./pages/ProductDetails";
import SearchResults from "./pages/SearchResults";
import PartnerPage from "./pages/PartnerPage";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import AdminLayout from "./components/admin/layout/AdminLayout";
import Admin from "./pages/Admin";
import SalonDashboard from "./pages/SalonDashboard";
import SalonDetails from "./pages/SalonDetails";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/deal/:id" element={<ProductDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin/*" element={<AdminLayout><Admin /></AdminLayout>} />
            <Route path="/salon/dashboard" element={<AdminLayout><SalonDashboard /></AdminLayout>} />
            <Route path="/salon/deal/:dealId" element={<AdminLayout><SalonDetails /></AdminLayout>} />
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
