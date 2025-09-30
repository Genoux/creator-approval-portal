"use client";

import { Squircle } from "@squircle-js/react";
import { ExternalLink } from "lucide-react";
import {
  InBeatIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface PortfolioPreviewProps {
  portfolio: Task["portfolio"];
  className?: string;
  title?: string;
  type?: "inbeat" | "example";
}

function getPlatform(url: string) {
  const urlLower = url.toLowerCase();

  if (urlLower.includes("instagram.com"))
    return { name: "Instagram", icon: InstagramIcon };
  if (urlLower.includes("tiktok.com"))
    return { name: "TikTok", icon: TikTokIcon };
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be"))
    return { name: "YouTube", icon: YouTubeIcon };
  if (urlLower.includes("linkedin.com"))
    return { name: "LinkedIn", icon: LinkedInIcon };

  return { name: "External Link", icon: ExternalLink };
}

export function PortfolioPreview({
  portfolio,
  title,
  className = "",
  type = "example",
}: PortfolioPreviewProps) {
  // Determine which URL to use based on type
  const url = type === "inbeat" ? portfolio.inBeatPortfolio : portfolio.example;

  if (!url) return null;

  const platform = getPlatform(url);
  const Icon = platform.icon;

  return (
    <div className={`border rounded-lg p-3 bg-white ${className}`}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div className="flex flex-row gap-3">
          <Squircle
            cornerRadius={10}
            cornerSmoothing={2}
            className="w-8 h-8 rounded-md  flex items-center justify-center flex-shrink-0"
          >
            <div
              className={cn(
                "w-8 h-8 rounded-md  flex items-center justify-center flex-shrink-0",
                {
                  "bg-[#2A0006]": type === "inbeat",
                  "bg-[#010101]": type === "example",
                }
              )}
            >
              {type === "inbeat" ? (
                <InBeatIcon className="w-4 h-4 text-white" />
              ) : (
                <Icon className="w-4 h-4 text-white" />
              )}
            </div>
          </Squircle>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {title || `${platform.name} Content`}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {url.slice(0, 30)}...
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(url, "_blank")}
          className="flex-shrink-0 cursor-pointer w-full sm:w-fit"
        >
          View
        </Button>
      </div>
    </div>
  );
}
