import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import Index from "./pages/Index";
import ProductDetails from "./pages/ProductDetails";
import SearchResults from "./pages/SearchResults";
import Admin from "./pages/Admin";
import ManageDeals from "./pages/ManageDeals";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/deal/:id" element={<ProductDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/manage-deals" element={<ManageDeals />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Router>
  );
}

export default App;