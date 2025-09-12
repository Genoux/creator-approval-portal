"use client";

import { LayoutDebug } from "layout-debug-tool";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ErrorBlock } from "@/components/shared/ErrorBlock";
import { Footer } from "@/components/shared/FooterBar";
import { NavigationBar } from "@/components/shared/NavigationBar";
import { TasksGrid } from "@/components/tasks/TasksGrid";
import { TasksGridSkeleton } from "@/components/tasks/TasksGridSkeleton";
import { TaskActionsProvider } from "@/contexts/TaskActionsContext";
import { useList } from "@/hooks/data/lists/useList";
import { useTasks } from "@/hooks/data/tasks/useTasks";
import type { AuthSession } from "@/lib/auth";

interface DashboardClientProps {
  session: AuthSession;
}

export function DashboardClient({ session }: DashboardClientProps) {
  // Find the Creator Management list
  const {
    data: creatorList,
    isLoading: listLoading,
    error: listError,
    refetch: refetchList,
  } = useList("Creator Management");

  // Get tasks from that list
  const {
    data: tasks = [],
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks(creatorList?.listId || null);

  const isLoading = listLoading || tasksLoading;
  const hasListError = listError || (!listLoading && !creatorList);
  const hasTasksError = tasksError;

  return (
    <LayoutDebug>
      <div className="min-h-screen bg-white flex flex-col">
        <NavigationBar session={session} />

        {/* Main Content */}
        <main className="flex-1 max-w-[1440px] mx-auto flex flex-col gap-6 py-12 px-8 w-full relative">
          <div className="flex justify-between items-center">
            <DashboardHeader taskCount={tasks.length} isLoading={isLoading} />
          </div>
          {isLoading ? (
            <TasksGridSkeleton />
          ) : hasListError ? (
            <ErrorBlock
              title="List Not Found"
              description="Make sure you have access to the list and try again."
              actionText="Retry"
              onAction={refetchList}
            />
          ) : hasTasksError ? (
            <ErrorBlock
              title="Error loading creators"
              description="Please try again later or contact support."
              actionText="Retry"
              onAction={refetchList}
            />
          ) : (
            <TaskActionsProvider listId={creatorList?.listId || null}>
              <TasksGrid tasks={tasks} />
            </TaskActionsProvider>
          )}
        </main>
        <Footer />
      </div>
    </LayoutDebug>
  );
}
