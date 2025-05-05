
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "@/components/layout/Layout";
import { SitemapRenderer } from "@/components/sitemap/SitemapRenderer";
import { RobotsRenderer } from "@/components/seo/RobotsRenderer";
import PageLoader from "@/components/PageLoader";

// Lazy load components to improve initial load time
const Index = lazy(() => import('./pages/Index'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const SalonDetails = lazy(() => import('./pages/SalonDetails'));
const SalonDealPage = lazy(() => import('./pages/SalonDealPage'));
const SalonLogin = lazy(() => import('./pages/SalonLogin'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));
const SecureDeal = lazy(() => import('./pages/SecureDeal'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const FAQ = lazy(() => import('./pages/FAQ'));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));

// Admin routes
const Admin = lazy(() => import('./pages/Admin'));
const SalonDashboard = lazy(() => import('./pages/SalonDashboard'));
const PartnerPage = lazy(() => import('./pages/PartnerPage'));
const PartnerSignup = lazy(() => import('./pages/PartnerSignup'));
const CreatorPage = lazy(() => import('./pages/CreatorPage'));
const CreatorSignup = lazy(() => import('./pages/CreatorSignup'));
const CreateAdmin = lazy(() => import('./pages/CreateAdmin'));
const AdminCollaborations = lazy(() => import('./pages/AdminCollaborations'));
const AdminCreators = lazy(() => import('./pages/AdminCreators'));
const AdminSubscriptions = lazy(() => import('./pages/AdminSubscriptions'));

// Error page for 404 and other errors
const NotFoundPage = lazy(() => import('./pages/NotFound'));

// Create the router with all routes
const router = createBrowserRouter([
  // SEO routes that don't use the layout
  {
    path: "/sitemap.xml",
    element: <SitemapRenderer />,
  },
  {
    path: "/robots.txt",
    element: <RobotsRenderer />,
  },
  
  // Authentication routes that don't need layout
  {
    path: "/update-password",
    element: (
      <Suspense fallback={<PageLoader />}>
        <UpdatePassword />
      </Suspense>
    ),
  },
  {
    path: "/salon/update-password",
    element: (
      <Suspense fallback={<PageLoader />}>
        <UpdatePassword />
      </Suspense>
    ),
  },
  
  // Main application with layout
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Index />
          </Suspense>
        ),
      },
      {
        path: "auth",
        element: <Navigate to="/salon/login" replace />,
      },
      {
        path: "search",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SearchResults />
          </Suspense>
        ),
      },
      {
        path: "deals/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProductDetails />
          </Suspense>
        ),
      },
      {
        path: "deal/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProductDetails />
          </Suspense>
        ),
      },
      {
        path: "secure-deal/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SecureDeal />
          </Suspense>
        ),
      },
      {
        path: "faq",
        element: (
          <Suspense fallback={<PageLoader />}>
            <FAQ />
          </Suspense>
        ),
      },
      {
        path: "terms",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Terms />
          </Suspense>
        ),
      },
      {
        path: "privacy",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Privacy />
          </Suspense>
        ),
      },
      {
        path: "partner",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PartnerPage />
          </Suspense>
        ),
      },
      {
        path: "partner/signup",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PartnerSignup />
          </Suspense>
        ),
      },
      {
        path: "creator",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreatorPage />
          </Suspense>
        ),
      },
      {
        path: "creator/signup",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreatorSignup />
          </Suspense>
        ),
      },
      {
        path: "bli-partner",
        element: <Navigate to="/partner" replace />,
      },
      {
        path: "salons/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SalonDetails />
          </Suspense>
        ),
      },
      {
        path: "salon/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SalonDetails />
          </Suspense>
        ),
      },
      {
        path: "subscription-success",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SubscriptionSuccess />
          </Suspense>
        ),
      },
      // Admin routes
      {
        path: "admin",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Admin />
          </Suspense>
        ),
      },
      {
        path: "admin/collaborations",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminCollaborations />
          </Suspense>
        ),
      },
      {
        path: "admin/creators",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminCreators />
          </Suspense>
        ),
      },
      {
        path: "admin/subscriptions",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminSubscriptions />
          </Suspense>
        ),
      },
      {
        path: "create-admin",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateAdmin />
          </Suspense>
        ),
      },
      // Salon routes
      {
        path: "salon/login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SalonLogin />
          </Suspense>
        ),
      },
      {
        path: "salon/dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SalonDashboard />
          </Suspense>
        ),
      },
    ],
  },
  // Catch all route for 404
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export default router;
