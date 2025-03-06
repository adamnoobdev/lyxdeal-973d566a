
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveGrid = ({ children, className = "" }: ResponsiveGridProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <ScrollArea className="w-full pb-4">
        <div className={`flex space-x-4 pb-2 px-4 overflow-x-auto scrollbar-hide ${className}`}>
          {React.Children.map(children, (child) => (
            <div className="min-w-[280px] max-w-[280px] flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }
  
  return (
    <div className={`grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className}`}>
      {children}
    </div>
  );
};
