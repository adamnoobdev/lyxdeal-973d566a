
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Layout from "./components/Layout"
import LandingPage from "./pages/LandingPage"
import DealPage from "./pages/DealPage"
import SalonPage from "./pages/SalonPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Terms from "@/pages/Terms"
import PartnerPage from "@/pages/PartnerPage"
import PartnerSignup from "@/pages/PartnerSignup"
import SalonDashboard from "@/pages/SalonDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import FaqPage from "./pages/FaqPage"
import Privacy from './pages/Privacy';
import SecureDeal from './pages/SecureDeal';
import IndexPage from "./pages/Index";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="lyxdeal-ui-theme">
        <Toaster />
        <RouterProvider router={createRouter()} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function createRouter() {
  return createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <IndexPage />,
        },
        {
          path: "/landing",
          element: <LandingPage />,
        },
        {
          path: "/deals/:dealId",
          element: <DealPage />,
        },
        {
          path: "/salons/:salonId",
          element: <SalonPage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/terms",
          element: <Terms />,
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
          path: "/salon/dashboard",
          element: <SalonDashboard />,
        },
        {
          path: "/admin",
          element: <AdminDashboard />,
        },
        {
          path: "/faq",
          element: <FaqPage />,
        },
        {
          path: "/privacy",
          element: <Privacy />,
        },
        {
          path: "/secure-deal/:id",
          element: <SecureDeal />,
        },
      ],
    },
  ]);
}

export default App;
