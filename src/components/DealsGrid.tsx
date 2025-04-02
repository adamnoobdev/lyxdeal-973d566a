
import { memo } from "react";
import { DealCard } from "./DealCard";
import { Deal } from "@/types/deal";
import { ResponsiveGrid } from "./common/ResponsiveGrid";

interface DealsGridProps {
  deals: Deal[];
  className?: string;
}

const DealsGridComponent = ({ deals, className = "" }: DealsGridProps) => {
  if (!deals?.length) {
    return null;
  }

  return (
    <ResponsiveGrid 
      className={className} 
      gap="gap-2 xs:gap-3 sm:gap-4" 
      columns="grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          {...deal}
        />
      ))}
    </ResponsiveGrid>
  );
};

export const DealsGrid = memo(DealsGridComponent);
