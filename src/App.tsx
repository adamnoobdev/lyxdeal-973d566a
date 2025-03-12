
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
import { AdminLayout } from "./components/admin/layout/AdminLayout";
import Admin from "./pages/Admin";
import SalonDashboard from "./pages/SalonDashboard";
import SalonDetails from "./pages/SalonDetails";
import NavigationBar from "./components/NavigationBar";
import { useSession } from "./hooks/useSession";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

function AppContent() {
  const { session } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user?.id) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('salons')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        setUserRole(data?.role || null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [session]);

  if (isLoading) return null;

  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <NavigationBar userRole={userRole} />
        <div className="flex-1 pt-16"> {/* Add padding-top here */}
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
        </div>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
