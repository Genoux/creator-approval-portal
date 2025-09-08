"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useBoardInfo } from "@/hooks/board/useBoardInfo";

export function DashboardHeader() {
  const { folderName, isLoading } = useBoardInfo();

  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex flex-col w-full">
          <Skeleton className="h-4 w-32 mb-1" />
          <div className="flex items-center gap-2 w-full justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col w-full">
        <div className="text-sm text-black/60">{folderName}</div>
        <div className="flex items-center gap-2 w-full justify-between">
          <h1 className="text-2xl font-bold text-black/90">
            {"Creator Management"}
          </h1>
        </div>
      </div>
    </div>
  );
}
