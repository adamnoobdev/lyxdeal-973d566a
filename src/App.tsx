import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Routes,
} from "react-router-dom";
import IndexPage from "@/pages/Index";
import SearchResults from "@/pages/SearchResults";
import FAQ from "@/pages/FAQ";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import PartnerPage from "@/pages/PartnerPage";
import PartnerSignup from "@/pages/PartnerSignup";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import ProductDetails from "@/pages/ProductDetails";
import SecureDeal from "@/pages/SecureDeal";
import Layout from "@/components/layout/Layout";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import CreateAdmin from './pages/CreateAdmin';

const queryClient = new QueryClient();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Analytics instance
getAnalytics(app);

function App() {
  // Setup routing using React Router's createBrowserRouter
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="partner" element={<PartnerPage />} />
            <Route path="partner/signup" element={<PartnerSignup />} />
            <Route path="partner/subscription-success" element={<SubscriptionSuccess />} />
            <Route path="deal/:id" element={<ProductDetails />} />
            <Route path="secure-deal/:id" element={<SecureDeal />} />
            <Route path="create-admin" element={<CreateAdmin />} />
          </Route>
          
          <Route path="/salon/*" element={<Layout />} />
          <Route path="/admin/*" element={<Layout />} />
          <Route path="/salon/login" element={<Layout />} />
          <Route path="/salon/register" element={<Layout />} />
          <Route path="/salon/update-password" element={<Layout />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
