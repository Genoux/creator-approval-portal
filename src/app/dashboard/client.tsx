"use client";

import { LayoutDebug } from "layout-debug-tool";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Footer } from "@/components/shared/FooterBar";
import { DashboardNavbar } from "@/components/shared/NavigationBar";
import { TasksGrid } from "@/components/tasks/TasksGrid";
import { TasksGridSkeleton } from "@/components/tasks/TasksGridSkeleton";
import { Button } from "@/components/ui/button";
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

  const hasListError = !listLoading && (listError || !creatorList);
  const hasTasksError = !tasksLoading && tasksError;

  function fallbackMessage(title: string, description: string) {
    return (
      <div className="bg-[#F9F7F7] rounded-2xl gap-4 p-8 w-full h-full text-center flex-1 flex flex-col items-center justify-center">
        <div>
          <h1 className="text-xl text-black">{title}</h1>
          <p className="text-black/50 mt-1">{description}</p>
        </div>
        <Button
          onClick={() => refetchList()}
          className="py-6 px-6 rounded-full bg-[#2A0006] text-white hover:bg-[#2A0006]/90 cursor-pointer"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <LayoutDebug>
      <div className="min-h-screen bg-white flex flex-col">
        <DashboardNavbar session={session} />

        {/* Main Content */}
        <main className="flex-1 max-w-[1440px] mx-auto flex flex-col gap-6 py-12 px-8 w-full relative">
          <DashboardHeader />
          {listLoading || tasksLoading ? (
            <TasksGridSkeleton />
          ) : hasListError ? (
            fallbackMessage(
              "List Not Found",
              "Make sure you have access to the list and try again."
            )
          ) : hasTasksError ? (
            fallbackMessage(
              "Error loading creators",
              "Please try again later or contact support."
            )
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
