//TODO: Handle edge case where a client have more than one creator management list

"use client";

import { LayoutDebug } from "layout-debug-tool";
import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ErrorBlock } from "@/components/shared/ErrorBlock";
import { Footer } from "@/components/shared/FooterBar";
import { NavigationBar } from "@/components/shared/NavigationBar";
import { StatusTabs } from "@/components/shared/StatusTabs";
import { TasksGrid } from "@/components/tasks/TasksGrid";
import { TasksGridSkeleton } from "@/components/tasks/TasksGridSkeleton";
import { useCreatorManagement } from "@/contexts/CreatorManagementContext";
import { DropdownProvider } from "@/contexts/DropdownContext";
import { StatusConfirmationProvider } from "@/contexts/StatusConfirmationContext";
import type { ApprovalLabel } from "@/types";
import { getDisplayLabel } from "@/utils/ui";

// Inner component that uses CreatorManagementContext
function ManagementContent({
  activeStatus,
  setActiveStatus,
}: {
  activeStatus: ApprovalLabel;
  setActiveStatus: (status: ApprovalLabel) => void;
}) {
  const { tasks, isLoading } = useCreatorManagement();

  // Filter tasks by active status
  const filteredTasks = useMemo(
    () => tasks.filter(task => task.status.label === activeStatus),
    [tasks, activeStatus]
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <DashboardHeader taskCount={tasks.length} isLoading={isLoading} />
      </div>
      <StatusTabs
        tasks={tasks}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />
      <TasksGrid
        tasks={filteredTasks}
        empty={{
          title: `No creators in "${getDisplayLabel(activeStatus)}"`,
          description:
            "Creators will appear here when they're assigned this status.",
        }}
      />
    </>
  );
}

export function ManagementClient() {
  const [activeStatus, setActiveStatus] = useState<ApprovalLabel>("For Review");
  const { isLoading, error, refetch } = useCreatorManagement();

  return (
    <LayoutDebug>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Main Content */}
        <main className="flex-1 max-w-7xl px-4  mx-auto flex flex-col gap-6 w-full relative">
          <NavigationBar />
          {isLoading ? (
            <>
              <div className="flex justify-between items-center">
                <DashboardHeader taskCount={0} isLoading={true} />
              </div>
              <TasksGridSkeleton />
            </>
          ) : error ? (
            <ErrorBlock
              title="Error Loading Dashboard"
              description="Make sure you have access to the list and try again."
              actionText="Retry"
              onAction={refetch}
            />
          ) : (
            <StatusConfirmationProvider>
              <DropdownProvider>
                <ManagementContent
                  activeStatus={activeStatus}
                  setActiveStatus={setActiveStatus}
                />
              </DropdownProvider>
            </StatusConfirmationProvider>
          )}
        </main>
        <Footer />
      </div>
    </LayoutDebug>
  );
}
