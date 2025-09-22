"use client";

import { InfoIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
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
import type { AuthSession } from "@/lib/auth";

const handleLogout = async () => {
  await fetch("/api/auth", { method: "DELETE" });
  window.location.href = "/";
};

interface DashboardNavbarProps {
  session: AuthSession | null;
}

export function NavigationBar({ session }: DashboardNavbarProps) {
  const user = session?.clickupUser;

  return (
    <nav>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="https://inbeat.agency/"
            target="_blank"
            className="flex items-center gap-2"
          >
            <InBeatIcon width={48} className="cursor-pointer" />
          </Link>
          <div className="flex items-center gap-2">
            {!user && (
              <Button
                variant="default"
                className="w-fit cursor-pointer rounded-full"
                size="sm"
                onClick={() =>
                  window.open("mailto:dev@inbeat.agency", "_blank")
                }
              >
                Help
              </Button>
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
                <DropdownMenuContent
                  className="w-56"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback>
                          {user.username.charAt(0)}
                        </AvatarFallback>
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
                      Go to ClickUp
                    </DropdownMenuItem>
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
      </div>
    </nav>
  );
}
