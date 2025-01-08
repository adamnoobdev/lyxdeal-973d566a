import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import ProductDetails from "./pages/ProductDetails";
import SearchResults from "./pages/SearchResults";
import AdminPage from "./pages/Admin";
import { Toaster } from "sonner";
import "./App.css";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;