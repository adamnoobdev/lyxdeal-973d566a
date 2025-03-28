
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
    <ResponsiveGrid className={`w-full ${className}`}>
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
