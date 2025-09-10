"use client";

import Image from "next/image";
import Link from "next/link";
import { ClickupIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Removed unused import

interface DashboardNavbarProps {
  onLogout?: () => void;
}

export function DashboardNavbar({ onLogout }: DashboardNavbarProps) {

  return (
    <nav className="border-b border-black/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="https://inbeat.agency/"
            target="_blank"
            className="flex items-center gap-2"
          >
            <Image
              src="/inBeat.svg"
              alt="inBeat"
              width={100}
              height={100}
              className="cursor-pointer"
            />
          </Link>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => window.open("https://app.clickup.com", "_blank")}
                  >
                    <ClickupIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clickup board</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {onLogout && (
              <Button
                onClick={onLogout}
                variant="secondary"
                className="cursor-pointer rounded-full"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
