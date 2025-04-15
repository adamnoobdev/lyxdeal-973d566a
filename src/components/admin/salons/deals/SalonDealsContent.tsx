
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealsTable } from "../../deals/DealsTable";
import { DealsLoadingSkeleton } from "../../deals/DealsLoadingSkeleton";
import { SalonDealsError } from "../SalonDealsError";
import { SalonDealsEmpty } from "../SalonDealsEmpty";
import { Deal } from "@/types/deal"; // Use the correct Deal type

interface SalonDealsContentProps {
  deals: Deal[];
  activeDeals: Deal[];
  inactiveDeals: Deal[];
  isLoading: boolean;
  error: string | null;
  handleEdit: (deal: Deal) => void;
  handleDeleteClick: (deal: Deal) => void;
  handleToggleActive: (deal: Deal) => Promise<boolean>;
  handleViewDiscountCodes: (deal: Deal) => void;
}

export const SalonDealsContent: React.FC<SalonDealsContentProps> = ({
  deals,
  activeDeals,
  inactiveDeals,
  isLoading,
  error,
  handleEdit,
  handleDeleteClick,
  handleToggleActive,
  handleViewDiscountCodes
}) => {
  if (isLoading) {
    return <DealsLoadingSkeleton />;
  }

  if (error) {
    return <SalonDealsError message={error} />;
  }

  if (!deals?.length) {
    return <SalonDealsEmpty />;
  }

  return (
    <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm p-2 sm:p-4">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4 w-full max-w-md bg-secondary/10 border border-secondary/30">
          <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-xs sm:text-sm">
            Aktiva erbjudanden ({activeDeals.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-xs sm:text-sm">
            Inaktiva erbjudanden ({inactiveDeals.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <DealsTable
            deals={activeDeals}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggleActive={handleToggleActive}
            onViewDiscountCodes={handleViewDiscountCodes}
          />
        </TabsContent>
        
        <TabsContent value="inactive">
          <DealsTable
            deals={inactiveDeals}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggleActive={handleToggleActive}
            onViewDiscountCodes={handleViewDiscountCodes}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
