
import { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveGrid = ({ children, className = "" }: ResponsiveGridProps) => {
  return (
    <div className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 ${className}`}>
      {children}
    </div>
  );
};
