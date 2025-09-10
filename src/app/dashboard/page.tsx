"use client";

import { LayoutDebug } from "layout-debug-tool";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useTasks } from "@/hooks/data/tasks/useTasks";

export default function DashboardPage() {
  const router = useRouter();
  const { data: tasks = [], isLoading, error } = useTasks();
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Check if session has a valid list selected
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Try to make a request to check if we have a valid session with listId
        const response = await fetch("/api/tasks");

        if (response.status === 401) {
          // No session at all - redirect to login
          router.push("/");
          return;
        }

        if (!response.ok) {
          // Session exists but no valid list - redirect to board selection
          router.push("/dashboard/select-board");
          return;
        }

        // Valid session with list
        setSessionValid(true);
      } catch (error) {
        console.error("Session check failed:", error);
        router.push("/");
      }
    };

    checkSession();
  }, [router]);

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

  // // Show loading while checking session
  // if (sessionValid === null) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="flex items-center space-x-2">
  //         <Loader2 className="h-6 w-6 animate-spin" />
  //         <span>Checking access...</span>
  //       </div>
  //     </div>
  //   );
  // }

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
