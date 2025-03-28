
import React, { memo } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveGridComponent = ({ children, className = "" }: ResponsiveGridProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="w-full -mx-4 overflow-x-auto touch-pan-x scrollbar-hide">
        <div className={`flex space-x-4 px-4 py-2 w-max ${className}`}>
          {React.Children.map(children, (child) => (
            <div className="min-w-[340px] max-w-[340px] flex-shrink-0">
              {child}
            </div>
          ))}
          <div className="min-w-4 flex-shrink-0" aria-hidden="true" />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 mx-auto w-full ${className}`}>
      {children}
    </div>
  );
};

export const ResponsiveGrid = memo(ResponsiveGridComponent);
