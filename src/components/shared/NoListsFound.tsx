"use client";

import { Button } from "@/components/ui/button";
import { useCreatorManagement } from "@/contexts/CreatorManagementContext";

export function NoListsFound() {
  const { refetch } = useCreatorManagement();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md space-y-4">
        <h2 className="text-2xl font-semibold">
          No Creator Management Lists Found
        </h2>
        <p className="text-muted-foreground">
          Make sure you have a list named &ldquo;Creator Management&rdquo;
          shared with your ClickUp account.
        </p>
        <Button onClick={refetch} className="mt-4">
          Refresh
        </Button>
      </div>
    </div>
  );
}
