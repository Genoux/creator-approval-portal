"use client";

import { LayoutDebug } from "layout-debug-tool";
import { Footer } from "@/components/shared/FooterBar";
import { NavigationBar } from "@/components/shared/NavigationBar";
import { TasksGrid } from "@/components/tasks/TasksGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreatorManagement } from "@/contexts/CreatorManagementContext";

export function SelectionsClient() {
  const { isLoading, getApprovedTasks } = useCreatorManagement();

  return (
    <LayoutDebug>
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 max-w-7xl px-4 mx-auto flex flex-col gap-12 w-full relative">
          <NavigationBar className="z-10" />
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Selections
                </h1>
                {!isLoading ? (
                  <p className="text-gray-600 mt-1">
                    You have {getApprovedTasks.length} creator
                    {getApprovedTasks.length !== 1 ? "s" : ""} selected
                  </p>
                ) : (
                  <Skeleton className="w-54 h-4 mt-3" />
                )}
              </div>
            </div>
            <TasksGrid
              tasks={getApprovedTasks}
              empty={{
                title: "No Selections Yet",
                description:
                  "Creators you approve as Perfect or Good will appear here.",
              }}
              loading={isLoading}
            />
          </div>
        </main>
        <Footer />
      </div>
    </LayoutDebug>
  );
}
