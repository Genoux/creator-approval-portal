"use client";

import { Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Footer() {
  const version = process.env.APP_VERSION;
  const buildTime = process.env.BUILD_TIME;

  console.log(version, buildTime);

  return (
    <footer className="px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="text-sm text-black/60">v{process.env.APP_VERSION}</div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  window.open("mailto:dev@inbeat.agency", "_blank");
                }}
              >
                <Bug className="w-4 h-4 opacity-80" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Report a bug</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </footer>
  );
}
