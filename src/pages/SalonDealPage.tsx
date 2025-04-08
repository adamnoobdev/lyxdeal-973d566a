
import React, { useState } from "react";
import { SalonLayout } from "@/components/salon/layout/SalonLayout";
import { SalonDeals } from "@/components/salon/SalonDeals";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SalonDealPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <SalonLayout>
      <Helmet>
        <title>Erbjudanden | Lyxdeal</title>
      </Helmet>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Dina erbjudanden</h1>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Skapa erbjudande
          </Button>
        </div>
        <p className="text-muted-foreground">
          Hantera dina aktiva och inaktiva erbjudanden
        </p>
        <SalonDeals initialCreateDialogOpen={isCreateDialogOpen} onCloseCreateDialog={() => setIsCreateDialogOpen(false)} />
      </div>
    </SalonLayout>
  );
}
