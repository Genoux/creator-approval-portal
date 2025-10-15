"use client";

import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Footer } from "@/components/shared/FooterBar";
import { NavigationBar } from "@/components/shared/NavigationBar";
import { StatusTabs } from "@/components/shared/StatusTabs";
import { TasksGrid } from "@/components/tasks/TasksGrid";
import { StatusConfirmationProvider } from "@/contexts/StatusConfirmationContext";
import { useTaskCounts } from "@/hooks/data/tasks/useTaskCounts";
import { useCreatorManagement } from "@/hooks/useCreatorManagement";
import type { StatusFilter } from "@/types";
import { filterTasksByStatus, getDisplayLabel } from "@/utils/status";

function ManagementContent({
  activeStatus,
  setActiveStatus,
}: {
  activeStatus: StatusFilter;
  setActiveStatus: (status: StatusFilter) => void;
}) {
  const { tasks, isLoading, selectedListId } = useCreatorManagement();
  const totalTaskCount = useTaskCounts(tasks, "All");

  const filteredTasks = useMemo(
    () => filterTasksByStatus(tasks, activeStatus),
    [tasks, activeStatus]
  );

  return (
    <div key={selectedListId} className="flex flex-col gap-8">
      <DashboardHeader loading={isLoading} taskCount={totalTaskCount} />
      <div className="flex flex-col gap-4">
        <StatusTabs
          tasks={tasks}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          loading={isLoading}
        />
        <TasksGrid
          tasks={filteredTasks}
          empty={{
            title: `No creators in "${getDisplayLabel(activeStatus)}"`,
            description:
              "Creators will appear here when they're assigned this status.",
          }}
          loading={isLoading}
          animationKey={activeStatus}
        />
      </div>
    </div>
  );
}

export function ManagementClient() {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("For Review");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 max-w-7xl px-4 mx-auto flex flex-col gap-10 w-full relative">
        <NavigationBar className="z-10" />
        <div className="flex flex-col gap-6">
          <StatusConfirmationProvider>
            <ManagementContent
              activeStatus={activeStatus}
              setActiveStatus={setActiveStatus}
            />
          </StatusConfirmationProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
}
