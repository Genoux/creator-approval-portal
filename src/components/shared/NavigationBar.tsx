"use client";

import {
  ArrowRightLeftIcon,
  ChevronDownIcon,
  InfoIcon,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ClickupIcon, InBeatIcon } from "@/components/icons";
import { ListSelection } from "@/components/shared/ListSelection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/contexts/AuthContext";
import { useTaskCounts } from "@/hooks/data/tasks/useTaskCounts";
import { useCreatorManagement } from "@/hooks/useCreatorManagement";
import { cn } from "@/lib/utils";

const handleLogout = async () => {
  await fetch("/auth", { method: "DELETE" });
  window.location.href = "/";
};

export function NavigationBar({ className }: { className?: string }) {
  const user = useCurrentUser();
  const pathname = usePathname();

  const { sharedLists, tasks } = useCreatorManagement();
  const [showListSelection, setShowListSelection] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isManagementActive = pathname === "/dashboard/management";
  const isSelectionsActive = pathname === "/dashboard/selections";

  const approvedCount = useTaskCounts(tasks, "Selected");

  return (
    <nav className={className}>
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center gap-2">
          <Link
            href="https://inbeat.agency/"
            target="_blank"
            className="flex items-center gap-2"
          >
            <InBeatIcon width={48} className="cursor-pointer" />
          </Link>
        </div>

        {/* Navigation Tabs */}
        {user && (
          <div className="gap-2 hidden sm:flex">
            <Link href="/dashboard/management" prefetch={true}>
              <Button
                variant="secondary"
                className={cn(
                  "bg-transparent transition-colors duration-75",
                  isManagementActive && "bg-black/5 hover:bg-black/5"
                )}
              >
                All Creators
              </Button>
            </Link>

            <Link href="/dashboard/selections" prefetch={true}>
              <Button
                variant="secondary"
                className={cn(
                  "bg-transparent transition-colors duration-75",
                  isSelectionsActive && "bg-black/5 hover:bg-black/5"
                )}
              >
                Approved
                {approvedCount > 0 && (
                  <span className="inline-flex items-center justify-center rounded-full min-w-5 h-5 px-1.5 text-xs font-medium bg-black/90 text-white leading-none">
                    {approvedCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2">
          {user && (
            <div className="flex gap-2 sm:hidden">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">
                    {isSelectionsActive ? "My Selections" : "Management"}
                    <ChevronDownIcon
                      className={cn(
                        "w-4 h-4 transition-transform duration-125 group-data-[state=open]:rotate-180",
                        isOpen && "rotate-180"
                      )}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      isManagementActive && "bg-black/5"
                    )}
                  >
                    <Link href="/dashboard/management" prefetch={true}>
                      Management
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      isSelectionsActive && "bg-black/5"
                    )}
                  >
                    <Link
                      className="flex items-center gap-2"
                      href="/dashboard/selections"
                      prefetch={true}
                    >
                      My Selections
                      {approvedCount > 0 && (
                        <span className="inline-flex items-center justify-center rounded-full min-w-4 h-4 px-1 text-[10px] font-medium bg-black/90 text-white leading-none">
                          {approvedCount}
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="transition-all duration-125 cursor-pointer hover:border-black/50 hover:border p-0.5 rounded-full border border-transparent data-[state=open]:border-black/50">
                  <Avatar>
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" sideOffset={4}>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user.username}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      window.open("https://app.clickup.com", "_blank")
                    }
                    className="cursor-pointer"
                  >
                    <ClickupIcon width={14} height={14} />
                    ClickUp
                  </DropdownMenuItem>
                  {sharedLists.length > 1 && (
                    <DropdownMenuItem
                      onClick={() => setShowListSelection(true)}
                      className="cursor-pointer"
                    >
                      <ArrowRightLeftIcon className="w-3 h-3" />
                      Change List
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() =>
                      window.open("mailto:dev@inbeat.agency", "_blank")
                    }
                    className="cursor-pointer"
                  >
                    <InfoIcon className="w-3 h-3" />
                    Contact Support
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOutIcon className="w-3.5 h-3.5" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <ListSelection
        show={showListSelection}
        onClose={() => setShowListSelection(false)}
      />
    </nav>
  );
}
