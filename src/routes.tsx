import React, { Suspense, lazy } from 'react';
import { RouteObject } from "react-router-dom";
import PageLoader from '@/components/PageLoader';

const LazyComponent = ({ importFunc }: { importFunc: () => Promise<any> }) => {
  const Component = lazy(importFunc);
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
};

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/Home')} />
    </Suspense>,
  },
  {
    path: "/salonger",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/Salons')} />
    </Suspense>,
  },
  {
    path: "/erbjudanden/:salonId?",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/Deals')} />
    </Suspense>,
  },
  {
    path: "/om-oss",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/About')} />
    </Suspense>,
  },
  {
    path: "/kontakt",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/Contact')} />
    </Suspense>,
  },
  {
    path: "/integritetspolicy",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/PrivacyPolicy')} />
    </Suspense>,
  },
  {
    path: "/anvandarvillkor",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/TermsOfService')} />
    </Suspense>,
  },
  {
    path: "/salong/:id",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/SalonDetails')} />
    </Suspense>,
  },
  {
    path: "/success",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/Success')} />
    </Suspense>,
  },
  {
    path: "/partner",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/Partner')} />
    </Suspense>,
  },
  {
    path: "/partner/success",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/PartnerSuccess')} />
    </Suspense>,
  },
  {
    path: "/partner/signup",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/PartnerSignup')} />
    </Suspense>,
  },
  {
    path: "/salon",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/Salon')} />
    </Suspense>,
  },
  {
    path: "/salon/deals",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/SalonDeals')} />
    </Suspense>,
  },
  {
    path: "/salon/settings",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/SalonSettings')} />
    </Suspense>,
  },
  {
    path: "/subscription-success",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/SubscriptionSuccess')} />
    </Suspense>
  },
  
  // Add our new admin subscriptions route
  {
    path: "/admin/subscriptions",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/AdminSubscriptions')} />
    </Suspense>
  },
  
  // Add a 404 route
  {
    path: "*",
    element: <Suspense fallback={<PageLoader />}>
      <LazyComponent importFunc={() => import('./pages/NotFound')} />
    </Suspense>,
  },
];
