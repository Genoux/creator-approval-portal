"use client";

import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <div className="bg-background shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">
            Creator Approval Portal
          </h1>
          <Button variant="ghost" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
