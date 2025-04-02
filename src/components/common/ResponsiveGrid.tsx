
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  columns?: string;
  gap?: string;
}

export const ResponsiveGrid = ({ children, className, columns, gap }: ResponsiveGridProps) => {
  return (
    <div className={cn(
      "grid", 
      columns || "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4", 
      gap || "gap-4 md:gap-6",
      className
    )}>
      {children}
    </div>
  );
};
