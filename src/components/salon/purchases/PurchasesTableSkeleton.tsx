
import { Skeleton } from "@/components/ui/skeleton";

export const PurchasesTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="h-8 w-full bg-secondary animate-pulse rounded"></div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 w-full bg-secondary/20 animate-pulse rounded"></div>
        ))}
      </div>
    </div>
  );
};
