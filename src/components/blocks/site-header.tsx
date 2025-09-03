"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface SiteHeaderProps {
  onLogout?: () => void;
  boardName?: string;
}

function getCurrentPageTitle(pathname: string): string {
  switch (pathname) {
    case "/dashboard":
      return "Creator Approval";
    case "/content":
      return "Content for Review";
    case "/briefs":
      return "Briefs for Review";
    default:
      return "Creator Approval Portal";
  }
}

export function SiteHeader({ onLogout }: SiteHeaderProps) {
  const pathname = usePathname();
  const pageTitle = getCurrentPageTitle(pathname);
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          {onLogout && (
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
