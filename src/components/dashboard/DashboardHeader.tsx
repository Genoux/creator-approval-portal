import { Skeleton } from "@/components/ui/skeleton";

export function DashboardHeader({
  taskCount,
  isLoading,
}: {
  taskCount: number;
  isLoading: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 w-full border-b border-black/10 pb-4">
      <div className="flex flex-col">
        <h3 className="text-sm text-black/60">Shared Lists</h3>
        <h1 className="text-2xl font-bold text-black/90">Creator Management</h1>
      </div>
      <div className="flex flex-col items-end justify-center">
        {isLoading ? (
          <div className="flex flex-col gap-2 items-end justify-center">
            <Skeleton className="w-10 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>
        ) : (
          <>
            <p className="text-xl font-bold text-black/90">{taskCount}</p>
            <h3 className="text-sm text-black/60 text-right">
              Available Creators
            </h3>
          </>
        )}
      </div>
    </div>
  );
}
