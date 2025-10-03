"use client";

import { LayoutDebug } from "layout-debug-tool";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ErrorBlock } from "@/components/shared/ErrorBlock";
import { Footer } from "@/components/shared/FooterBar";
import { NavigationBar } from "@/components/shared/NavigationBar";
import { TasksGrid } from "@/components/tasks/TasksGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreatorManagement } from "@/contexts/CreatorManagementContext";

export function SelectionsClient() {
  const { tasks, isLoading, error, refetch, selectedListId } =
    useCreatorManagement();

  const router = useRouter();

  useEffect(() => {
    if (!selectedListId) {
      router.replace("/dashboard/management");
    }
  }, [router, selectedListId]);

  // Filter only approved creators (Perfect + Good)
  const selectedCreators = useMemo(
    () =>
      tasks.filter(
        task =>
          task.status.label === "Perfect (Approved)" ||
          task.status.label === "Good (Approved)"
      ),
    [tasks]
  );

  return (
    <LayoutDebug>
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 max-w-7xl px-4 mx-auto flex flex-col gap-12 w-full relative">
          <NavigationBar className="z-10" selectedListId={selectedListId} />
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Selections
                </h1>
                {!isLoading ? (
                  <p className="text-gray-600 mt-1">
                    You have {selectedCreators.length} creator
                    {selectedCreators.length !== 1 ? "s" : ""} selected
                  </p>
                ) : (
                  <Skeleton className="w-54 h-4 mt-3" />
                )}
              </div>
            </div>
            {error ? (
              <ErrorBlock
                title="Error Loading Dashboard"
                description="Make sure you have access to the list and try again."
                actionText="Retry"
                onAction={refetch}
              />
            ) : (
              <TasksGrid
                tasks={selectedCreators}
                empty={{
                  title: "No Selections Yet",
                  description:
                    "Creators you approve as Perfect or Good will appear here.",
                }}
                loading={isLoading}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </LayoutDebug>
  );
}
