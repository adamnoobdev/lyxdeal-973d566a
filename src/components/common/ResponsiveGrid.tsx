
import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveGrid = ({ children, className = "" }: ResponsiveGridProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="w-full -mx-4">
        <ScrollArea className="pb-4">
          <div className={`flex gap-3 px-4 pb-1 overflow-x-auto scrollbar-hide ${className}`}>
            {Array.isArray(children) ? children.map((child, index) => (
              <div key={index} className="min-w-[230px] max-w-[270px] flex-shrink-0">
                {child}
              </div>
            )) : children}
          </div>
        </ScrollArea>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 ${className}`}>
      {children}
    </div>
  );
};
