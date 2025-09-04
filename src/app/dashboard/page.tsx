"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/blocks/app-sidebar";
import { SiteHeader } from "@/components/blocks/site-header";
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
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useCreators } from "@/hooks/creators/useCreators";

export default function DashboardPage() {
  const { data: tasks = [], isLoading, error } = useCreators();

  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader onLogout={handleLogout} />
        <div className="flex flex-1 flex-col py-4">
          {tasks.length > 0 && (
            <div className="px-4 lg:px-6 mb-2">
              <div className="text-xs text-muted-foreground">
                Showing: {tasks.length} creators
              </div>
            </div>
          )}
          <TasksGrid
            tasks={tasks}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />
        </div>
      </SidebarInset>

      <AlertDialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Proof of Concept</AlertDialogTitle>
            <AlertDialogDescription>
              This is a <strong>Proof of Concept</strong> application for
              demonstration purposes.
              <br />
              <br />
              All features, data, and functionality shown here are subject to
              change and should not be considered final or production-ready.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDisclaimerClose}>
              I Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
