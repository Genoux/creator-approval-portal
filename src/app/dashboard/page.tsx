"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { TasksGrid } from "@/components/TasksGrid";
import { useTasks } from "@/hooks/useTasks";

export default function DashboardPage() {
  const { data: tasks = [], isLoading, error } = useTasks();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/";
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading tasks</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={handleLogout} />
      <TasksGrid tasks={tasks} isLoading={isLoading} />
    </div>
  );
}
