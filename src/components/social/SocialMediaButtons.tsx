import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import {
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Social } from "@/types";

interface SocialMediaButtonsProps {
  socials: Social[];
  variant?: "light" | "dark";
  className?: string;
}

const PLATFORM_ICONS = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  YouTube: YouTubeIcon,
  LinkedIn: LinkedInIcon,
  Portfolio: ExternalLinkIcon,
} as const;

const ICON_STYLES = "w-4 h-4 text-white transition-colors";

export function SocialMediaButtons({
  socials,
  variant = "light",
  className,
}: SocialMediaButtonsProps) {
  return (
    <section className="flex gap-1">
      {socials.map(({ url, platform }) => {
        const Icon =
          PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS] ||
          ExternalLinkIcon;

        return (
          <TooltipProvider key={platform}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={url}
                  onClick={e => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group p-1.5 rounded-md hover:bg-white/10 transition-colors border",
                    variant === "dark" && "hover:bg-black/10",
                    className
                  )}
                >
                  <Icon
                    className={cn(
                      ICON_STYLES,
                      variant === "dark" && "text-black"
                    )}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>{platform}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </section>
  );
}
