interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveGrid = ({ children, className = "" }: ResponsiveGridProps) => {
  return (
    <div className={`grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className}`}>
      {children}
    </div>
  );
};