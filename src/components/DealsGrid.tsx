
import { memo } from "react";
import { DealCard } from "./DealCard";
import { Deal } from "@/types/deal";
import { ResponsiveGrid } from "./common/ResponsiveGrid";

interface DealsGridProps {
  deals: Deal[];
  className?: string;
  scrollable?: boolean;
}

const DealsGridComponent = ({ deals, className = "", scrollable = false }: DealsGridProps) => {
  if (!deals?.length) {
    return null;
  }

  if (scrollable) {
    return (
      <div className={`overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 ${className}`}>
        <div className="flex gap-3 min-w-max">
          {deals.map((deal) => (
            <div key={deal.id} className="w-[180px] xs:w-[240px] sm:w-[260px] md:w-[280px] min-w-[180px] flex-shrink-0">
              <DealCard {...deal} className="h-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ResponsiveGrid 
      className={className} 
      gap="gap-4" 
      columns="grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
    >
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          {...deal}
          className="h-full"
        />
      ))}
    </ResponsiveGrid>
  );
};

export const DealsGrid = memo(DealsGridComponent);
