
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
      <div className={`overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 ${className}`}>
        <div className="flex gap-3">
          {deals.map((deal) => (
            <div key={deal.id} className="w-[160px] xs:w-[180px] sm:w-[190px] lg:w-[200px] min-w-[160px] flex-shrink-0">
              <DealCard {...deal} className="h-full" compact={true} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Use different column layouts for search-results-grid
  const isSearchGrid = className?.includes('search-results-grid');
  const gridColumns = isSearchGrid 
    ? "grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
    : "grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6";

  return (
    <ResponsiveGrid 
      className={className} 
      gap="gap-3 sm:gap-4" 
      columns={gridColumns}
    >
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          {...deal}
          className="h-full"
          compact={true}
        />
      ))}
    </ResponsiveGrid>
  );
};

export const DealsGrid = memo(DealsGridComponent);
