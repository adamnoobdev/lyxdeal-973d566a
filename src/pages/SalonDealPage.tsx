
import React from "react";
import { SalonLayout } from "@/components/salon/layout/SalonLayout";
import { SalonDeals } from "@/components/salon/SalonDeals";
import { Helmet } from "react-helmet";

export default function SalonDealPage() {
  return (
    <SalonLayout>
      <Helmet>
        <title>Erbjudanden | Lyxdeal</title>
      </Helmet>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Dina erbjudanden</h1>
        <p className="text-muted-foreground">
          Hantera dina aktiva och inaktiva erbjudanden
        </p>
        <SalonDeals />
      </div>
    </SalonLayout>
  );
}
