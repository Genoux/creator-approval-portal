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

export function SocialMediaButtons({ socials }: SocialMediaButtonsProps) {
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
                  className="p-1.5 rounded-md hover:bg-black/5 transition-colors border"
                >
                  <Icon className="w-4 h-4 text-black transition-colors" />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="z-[9999]">{platform}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </section>
  );
}
