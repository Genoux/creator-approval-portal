"use client";

import { LayoutDebug } from "layout-debug-tool";
import { useMemo } from "react";
import { ErrorBlock } from "@/components/shared/ErrorBlock";
import { Footer } from "@/components/shared/FooterBar";
import { NavigationBar } from "@/components/shared/NavigationBar";
import { TasksGrid } from "@/components/tasks/TasksGrid";
import { TasksGridSkeleton } from "@/components/tasks/TasksGridSkeleton";
import { useCreatorManagement } from "@/contexts/CreatorManagementContext";

export function SelectionsClient() {
  const { tasks, isLoading, error, refetch } = useCreatorManagement();

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
        {/* Main Content */}
        <main className="flex-1 max-w-7xl px-4 mx-auto flex flex-col gap-6 w-full relative">
          <NavigationBar />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Selections
              </h1>
              {!isLoading && (
                <p className="text-gray-600 mt-1">
                  You have {selectedCreators.length} creator
                  {selectedCreators.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>
          {isLoading ? (
            <TasksGridSkeleton />
          ) : error ? (
            <ErrorBlock
              title="Error Loading Dashboard"
              description="Make sure you have access to the list and try again."
              actionText="Retry"
              onAction={refetch}
            />
          ) : selectedCreators.length === 0 ? (
            <ErrorBlock
              title="No Selections Yet"
              description="Creators you approve as Perfect or Good will appear here."
            />
          ) : (
            <TasksGrid
              tasks={selectedCreators}
              empty={{
                title: "No Selections Yet",
                description:
                  "Creators you approve as Perfect or Good will appear here.",
              }}
            />
          )}
        </main>
        <Footer />
      </div>
    </LayoutDebug>
  );
}
