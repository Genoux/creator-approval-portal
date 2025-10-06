"use client";

import { LayoutDebug } from "layout-debug-tool";
import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Footer } from "@/components/shared/FooterBar";
import { NavigationBar } from "@/components/shared/NavigationBar";
import { StatusTabs } from "@/components/shared/StatusTabs";
import { TasksGrid } from "@/components/tasks/TasksGrid";
import { useCreatorManagement } from "@/contexts/CreatorManagementContext";
import { DropdownProvider } from "@/contexts/DropdownContext";
import { StatusConfirmationProvider } from "@/contexts/StatusConfirmationContext";
import type { ApprovalLabel } from "@/types";
import { getDisplayLabel } from "@/utils/ui";

function ManagementContent({
  activeStatus,
  setActiveStatus,
}: {
  activeStatus: ApprovalLabel;
  setActiveStatus: (status: ApprovalLabel) => void;
}) {
  const { tasks, isLoading, selectedListId } = useCreatorManagement();

  const filteredTasks = useMemo(
    () => tasks.filter(task => task.status.label === activeStatus),
    [tasks, activeStatus]
  );

  return (
    <div key={selectedListId} className="flex flex-col gap-8">
      <DashboardHeader loading={isLoading} taskCount={tasks.length} />
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
        />
      </div>
    </div>
  );
}

export function ManagementClient() {
  const [activeStatus, setActiveStatus] = useState<ApprovalLabel>("For Review");

  return (
    <LayoutDebug>
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 max-w-7xl px-4 mx-auto flex flex-col gap-10 w-full relative">
          <NavigationBar className="z-10" />
          <div className="flex flex-col gap-6">
            <StatusConfirmationProvider>
              <DropdownProvider>
                <ManagementContent
                  activeStatus={activeStatus}
                  setActiveStatus={setActiveStatus}
                />
              </DropdownProvider>
            </StatusConfirmationProvider>
          </div>
        </main>
        <Footer />
      </div>
    </LayoutDebug>
  );
}
