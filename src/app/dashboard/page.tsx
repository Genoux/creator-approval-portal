"use client";

import { LayoutDebug } from "layout-debug-tool";
import { useEffect, useState } from "react";
import { Footer } from "@/components/blocks/footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { TasksGrid } from "@/components/tasks/TasksGrid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCreators } from "@/hooks/creators/useCreators";

export default function DashboardPage() {
  const { data: tasks = [], isLoading, error } = useCreators();

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleDisclaimerClose = () => {
    setShowDisclaimer(false);
    localStorage.setItem("hasSeenDisclaimer", "true");
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/";
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading tasks</div>
      </div>
    );
  }

  return (
    <LayoutDebug>
      <div className="min-h-screen bg-white flex flex-col">
        <DashboardNavbar onLogout={handleLogout} />

        {/* Main Content */}
        <main className="flex-1 max-w-[1280px] mx-auto flex flex-col gap-6 py-12 px-6 w-full">
          <DashboardHeader />
          <TasksGrid tasks={tasks} isLoading={isLoading} />
        </main>

        <AlertDialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>⚠️ Alpha Version</AlertDialogTitle>
              <AlertDialogDescription>
                This is an <strong>Alpha version</strong> of the application and
                is not yet finished.
                <br />
                <br />
                You may encounter bugs, incomplete features, or unexpected
                behavior. All functionality is subject to change and should not
                be considered stable or production-ready.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleDisclaimerClose}>
                I Understand
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Footer />
      </div>
    </LayoutDebug>
  );
}
