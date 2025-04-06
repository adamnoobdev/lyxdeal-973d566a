
import { memo } from "react";
import { DealCard } from "./DealCard";
import { Deal } from "@/types/deal";
import { ResponsiveGrid } from "./common/ResponsiveGrid";

interface DealsGridProps {
  deals: Deal[];
  className?: string;
  scrollable?: boolean;
  compact?: boolean;
}

const DealsGridComponent = ({ deals, className = "", scrollable = false, compact = true }: DealsGridProps) => {
  if (!deals?.length) {
    return null;
  }

  if (scrollable) {
    return (
      <div className={`overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 ${className}`}>
        <div className="flex gap-2 min-w-max">
          {deals.map((deal) => (
            <div key={deal.id} className="w-[150px] xs:w-[170px] sm:w-[180px] md:w-[200px] min-w-[150px] flex-shrink-0">
              <DealCard {...deal} className="h-full" compact={compact} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ResponsiveGrid 
      className={className} 
      gap="gap-2" 
      columns="grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
    >
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          {...deal}
          className="h-full"
          compact={compact}
        />
      ))}
    </ResponsiveGrid>
  );
};

export const DealsGrid = memo(DealsGridComponent);
