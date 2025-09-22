import { Skeleton } from "@/components/ui/skeleton";

export function TasksGridSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Skeleton Tabs */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }, () => (
          <Skeleton
            key={Math.random()}
            className="h-12 w-32 rounded-full bg-[#F9F7F7]"
          />
        ))}
      </div>

      {/* Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 9 }, () => (
          <Skeleton
            key={Math.random()}
            className="h-[500px] w-full rounded-3xl bg-[#F9F7F7]"
          />
        ))}
      </div>
    </div>
  );
}
