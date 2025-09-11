"use client";

import { ExternalLink } from "lucide-react";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface SocialPreviewProps {
  url: string;
  className?: string;
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
    return { name: "LinkedIn", icon: ExternalLink };

  return { name: "External Link", icon: ExternalLink };
}

export function SocialPreview({ url, className = "" }: SocialPreviewProps) {
  const platform = getPlatform(url);
  const Icon = platform.icon;

  return (
    <div className={`border rounded-lg p-3 bg-white ${className}`}>
      <div className="flex flex-col md:flex-row items-start justify-between gap-3">
        <div className="flex flex-row gap-3">
          <div
            className={`w-8 h-8 rounded-sm bg-[#010101] flex items-center justify-center flex-shrink-0`}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {platform.name} Content
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
          className="flex-shrink-0 cursor-pointer w-full md:w-fit"
        >
          View
        </Button>
      </div>
    </div>
  );
}
