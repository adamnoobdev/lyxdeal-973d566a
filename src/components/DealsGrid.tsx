import { memo, useCallback } from "react";
import { DealCard } from "@/components/DealCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Deal {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  timeRemaining: string;
  category: string;
  city: string;
  created_at: string;
}

interface DealsGridProps {
  deals: Deal[];
  onDealClick?: (dealId: number) => void;
}

const DealsGridComponent = ({ deals, onDealClick }: DealsGridProps) => {
  const handleDealClick = useCallback((dealId: number) => {
    onDealClick?.(dealId);
  }, [onDealClick]);

  return (
    <>
      {/* Mobile Layout - Horizontal Scroll */}
      <div className="block sm:hidden">
        <ScrollArea className="w-full whitespace-nowrap rounded-lg will-change-transform">
          <div className="flex space-x-4 pb-4 px-4">
            {deals.map((deal) => (
              <div 
                key={deal.id} 
                onClick={() => handleDealClick(deal.id)}
                className="w-[280px] shrink-0 first:ml-4 transition-transform duration-300 hover:scale-[0.98] will-change-transform"
              >
                <DealCard {...deal} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="opacity-0 sm:opacity-100" />
        </ScrollArea>
      </div>

      {/* Desktop Layout - Grid */}
      <div className="hidden sm:grid gap-4 px-4 sm:px-0 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {deals.map((deal) => (
          <div 
            key={deal.id} 
            onClick={() => handleDealClick(deal.id)}
            className="transform-gpu"
          >
            <DealCard {...deal} />
          </div>
        ))}
      </div>
    </>
  );
};

export const DealsGrid = memo(DealsGridComponent);