import { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveGrid({ children, className = "" }: ResponsiveGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {children}
    </div>
  );
}