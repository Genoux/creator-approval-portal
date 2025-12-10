"use client";

import { NavigationBar } from "@/components/shared/NavigationBar";
import { Button } from "@/components/ui/button";

export function NoListsFound() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    await fetch("/auth", { method: "DELETE" });
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 max-w-7xl px-4 mx-auto flex flex-col gap-12 w-full relative">
        <NavigationBar className="absolute top-0 left-0 w-full" />
        <div className="h-full flex-1  flex flex-col items-center justify-center">
          <div className="text-center max-w-md space-y-4">
            <h2 className="text-2xl font-semibold">
              No Creator Management Lists Found
            </h2>
            <p className="text-muted-foreground">
              Make sure you have a list named &ldquo;Creator Management&rdquo;
              shared with your ClickUp account.
            </p>
            <div className="flex mt-8 gap-2 justify-center">
              <Button
                className="cursor-pointer rounded-full bg-[#2A0006] text-white hover:bg-[#2A0006]/90"
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button
                className="cursor-pointer rounded-full"
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
