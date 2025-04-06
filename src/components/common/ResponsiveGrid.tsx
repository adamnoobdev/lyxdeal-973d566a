
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
      columns || "grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6", 
      gap || "gap-2",
      className
    )}>
      {children}
    </div>
  );
};
