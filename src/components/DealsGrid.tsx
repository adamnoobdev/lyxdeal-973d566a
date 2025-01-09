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
  quantityLeft: number;
}

interface DealsGridProps {
  deals: Deal[];
  onDealClick?: (dealId: number) => void;
}

const MobileDealsView = memo(({ deals, onDealClick }: DealsGridProps) => (
  <ScrollArea className="w-full whitespace-nowrap rounded-lg">
    <div className="flex space-x-4 pb-4 px-4">
      {deals.map((deal, index) => (
        <div 
          key={deal.id} 
          onClick={() => onDealClick?.(deal.id)}
          className="w-[280px] shrink-0 first:ml-4 animate-fade-in"
          style={{ 
            animationDelay: `${index * 50}ms`,
          }}
        >
          <DealCard {...deal} />
        </div>
      ))}
    </div>
    <ScrollBar orientation="horizontal" className="opacity-0 sm:opacity-100" />
  </ScrollArea>
));

MobileDealsView.displayName = 'MobileDealsView';

const DesktopDealsView = memo(({ deals, onDealClick }: DealsGridProps) => (
  <div className="grid gap-4 px-4 sm:px-0 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {deals.map((deal, index) => (
      <div 
        key={deal.id} 
        onClick={() => onDealClick?.(deal.id)}
        className="animate-fade-in"
        style={{ 
          animationDelay: `${index * 50}ms`,
        }}
      >
        <DealCard {...deal} />
      </div>
    ))}
  </div>
));

DesktopDealsView.displayName = 'DesktopDealsView';

const DealsGridComponent = ({ deals, onDealClick }: DealsGridProps) => {
  const handleDealClick = useCallback((dealId: number) => {
    onDealClick?.(dealId);
  }, [onDealClick]);

  return (
    <>
      <div className="block sm:hidden">
        <MobileDealsView deals={deals} onDealClick={handleDealClick} />
      </div>
      <div className="hidden sm:block">
        <DesktopDealsView deals={deals} onDealClick={handleDealClick} />
      </div>
    </>
  );
};

export const DealsGrid = memo(DealsGridComponent);