import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Admin from "./pages/Admin";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import ProductDetails from "./pages/ProductDetails";
import PartnerPage from "./pages/PartnerPage";
import PartnerSignup from "./pages/PartnerSignup";
import CreatorPage from "./pages/CreatorPage";
import CreatorSignup from "./pages/CreatorSignup";
import SalonLogin from "./pages/SalonLogin";
import SalonDashboard from "./pages/SalonDashboard";
import SalonDetails from "./pages/SalonDetails";
import SalonSettings from "./pages/SalonSettings";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";
import { Suspense, lazy } from "react";
import UpdatePassword from "./pages/UpdatePassword";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SecureDeal from "./pages/SecureDeal";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import CreateAdmin from "./pages/CreateAdmin";
import AdminCollaborations from "./pages/AdminCollaborations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/subscriptions",
    element: <AdminSubscriptions />,
  },
  {
    path: "/admin/create",
    element: <CreateAdmin />,
  },
  {
    path: "/admin/collaborations",
    element: <AdminCollaborations />,
  },
  {
    path: "/search",
    element: <SearchResults />,
  },
  {
    path: "/deal/:id",
    element: <ProductDetails />,
  },
  {
    path: "/secure/:id",
    element: <SecureDeal />,
  },
  {
    path: "/partner",
    element: <PartnerPage />,
  },
  {
    path: "/partner/signup",
    element: <PartnerSignup />,
  },
  {
    path: "/creator",
    element: <CreatorPage />,
  },
  {
    path: "/creator/signup",
    element: <CreatorSignup />,
  },
  {
    path: "/salon/login",
    element: <SalonLogin />,
  },
  {
    path: "/salon/dashboard",
    element: <SalonDashboard />,
  },
  {
    path: "/salon/settings",
    element: <SalonSettings />,
  },
  {
    path: "/salon/:id",
    element: <SalonDetails />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/update-password",
    element: <UpdatePassword />,
  },
  {
    path: "/salon/update-password",
    element: <UpdatePassword />,
  },
  {
    path: "/subscription/success",
    element: <SubscriptionSuccess />,
  }
]);

export default function Routes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
