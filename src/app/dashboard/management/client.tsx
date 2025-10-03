"use client";

import { LayoutDebug } from "layout-debug-tool";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ErrorBlock } from "@/components/shared/ErrorBlock";
import { Footer } from "@/components/shared/FooterBar";
import { ListSelection } from "@/components/shared/ListSelection";
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

  const showListSelection = !selectedListId;
  const isLocked = isLoading || !selectedListId;

  return (
    <>
      {showListSelection && (
        <div className="fixed inset-0 z-50 bg-white/50 backdrop-blur-sm pointer-events-auto">
          <ListSelection />
        </div>
      )}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          <DashboardHeader loading={isLocked} taskCount={tasks.length} />
          <div className="flex flex-col gap-4">
            <StatusTabs
              tasks={tasks}
              activeStatus={activeStatus}
              onStatusChange={setActiveStatus}
              loading={isLocked}
            />
            <TasksGrid
              tasks={filteredTasks}
              empty={{
                title: `No creators in "${getDisplayLabel(activeStatus)}"`,
                description:
                  "Creators will appear here when they're assigned this status.",
              }}
              loading={isLocked}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export function ManagementClient() {
  const [activeStatus, setActiveStatus] = useState<ApprovalLabel>("For Review");
  const { error, refetch, selectedListId } = useCreatorManagement();

  return (
    <LayoutDebug>
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 max-w-7xl px-4 mx-auto flex flex-col gap-10 w-full relative">
          <NavigationBar className="z-10" selectedListId={selectedListId} />
          <div className="flex flex-col gap-6">
            {error ? (
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
          </div>
        </main>
        <Footer />
      </div>
    </LayoutDebug>
  );
}
