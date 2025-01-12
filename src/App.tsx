import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import ProductDetails from "./pages/ProductDetails";
import SearchResults from "./pages/SearchResults";
import SalonLogin from "./pages/SalonLogin";
import SalonDashboard from "./pages/SalonDashboard";
import Auth from "./pages/Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/deals/:id" element={<ProductDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/salon/login" element={<SalonLogin />} />
        <Route path="/salon/dashboard" element={<SalonDashboard />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;