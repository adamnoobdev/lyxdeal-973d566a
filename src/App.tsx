import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Index from './pages/Index';
import ProductDetails from './pages/ProductDetails';
import Auth from './pages/Auth';
import SearchResults from './pages/SearchResults';
import Admin from './pages/Admin';
import SalonDashboard from './pages/SalonDashboard';
import SalonLogin from './pages/SalonLogin';
import SalonDetails from './pages/SalonDetails';
import PartnerPage from './pages/PartnerPage';
import PartnerSignup from './pages/PartnerSignup';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import SecureDeal from './pages/SecureDeal';
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import { SalonDeals } from './components/salon/SalonDeals';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="auth" element={<Auth />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="deals/:id" element={<ProductDetails />} />
          <Route path="deal/:id" element={<ProductDetails />} />
          <Route path="secure-deal/:id" element={<SecureDeal />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="terms" element={<Terms />} />
          <Route path="partner" element={<PartnerPage />} />
          <Route path="partner/signup" element={<PartnerSignup />} />
          <Route path="bli-partner" element={<PartnerPage />} />
          <Route path="salons/:id" element={<SalonDetails />} />
          <Route path="/subscription-success" element={<SubscriptionSuccess />} />
          
          <Route path="/admin/*" element={<Admin />} />
          
          <Route path="/salon/login" element={<SalonLogin />} />
          <Route path="/salon/dashboard" element={<SalonDashboard />} />
          <Route path="/salon/deal" element={<SalonDeals />} />
          <Route path="/salon/deals" element={<SalonDeals />} />
          <Route path="/salon/customers" element={<SalonDashboard />} />
          <Route path="/salon/settings" element={<SalonDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
