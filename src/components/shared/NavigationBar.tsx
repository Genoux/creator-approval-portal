"use client";

import {
  ArrowRightLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  InfoIcon,
  LogOutIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ClickupIcon, InBeatIcon } from "@/components/icons";
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
import { useCreatorManagement } from "@/contexts/CreatorManagementContext";
import { cn } from "@/lib/utils";

const handleLogout = async () => {
  await fetch("/auth", { method: "DELETE" });
  window.location.href = "/";
};

const NAV_TABS = [
  { label: "Management", href: "/dashboard/management", icon: <UsersIcon /> },
  {
    label: "My Selections",
    href: "/dashboard/selections",
    icon: <CheckIcon />,
  },
];

export function NavigationBar({
  className,
  selectedListId,
}: {
  className?: string;
  selectedListId?: string | null;
}) {
  const user = useCurrentUser();
  const pathname = usePathname();

  const { setSelectedListId, sharedLists, tasks } = useCreatorManagement();
  const showChangeList = sharedLists.length > 1;

  const getSelectionCount = (tabLabel: string) => {
    if (tabLabel === "My Selections") {
      return tasks.filter(
        task =>
          task.status.label === "Perfect (Approved)" ||
          task.status.label === "Good (Approved)"
      ).length;
    }
    return 0;
  };

  const [activeTab, setActiveTab] = useState<string>(NAV_TABS[0].label);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setActiveTab(
      NAV_TABS.find(tab => tab.href === pathname)?.label || NAV_TABS[0].label
    );
  }, [pathname]);

  return (
    <nav className={cn(className, "z-50")}>
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
        {user && selectedListId && (
          <div className="gap-2 hidden sm:flex">
            {NAV_TABS.map(tab => {
              const isActive = activeTab === tab.label;
              const count = getSelectionCount(tab.label);
              return (
                <Link key={tab.href} href={tab.href} prefetch={true}>
                  <Button
                    variant="secondary"
                    className={cn(
                      "bg-transparent transition-colors duration-75",
                      isActive && "bg-black/5 hover:bg-black/5"
                    )}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span className="inline-flex items-center justify-center rounded-full min-w-5 h-5 px-1.5 text-xs font-medium bg-black/90 text-white leading-none">
                        {count}
                      </span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2">
          {user && selectedListId && (
            <div className="flex gap-2 sm:hidden">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">
                    {activeTab}
                    <ChevronDownIcon
                      className={cn(
                        "w-4 h-4 transition-transform duration-125",
                        isOpen && "rotate-180"
                      )}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {NAV_TABS.map(tab => (
                    <DropdownMenuItem
                      key={tab.href}
                      className={cn(
                        "cursor-pointer",
                        activeTab === tab.label && "bg-black/5"
                      )}
                      onClick={() => {
                        setActiveTab(tab.label);
                        setIsOpen(false);
                      }}
                    >
                      <Link key={tab.href} href={tab.href} prefetch={true}>
                        {tab.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
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
                  {showChangeList && (
                    <DropdownMenuItem
                      onClick={() => setSelectedListId(null)}
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
    </nav>
  );
}
