import { Skeleton } from "@/components/ui/skeleton";

export const DealsLoadingSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-12 w-[150px]" />
          <Skeleton className="h-12 w-[150px]" />
          <Skeleton className="h-12 w-[100px]" />
          <Skeleton className="h-12 w-[100px]" />
        </div>
      ))}
    </div>
  );
};