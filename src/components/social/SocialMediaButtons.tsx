import Link from "next/link";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SocialProfile {
  platform: "Instagram" | "TikTok" | "YouTube";
  url: string | null;
  handle?: string | null;
}

interface SocialMediaButtonsProps {
  socialProfiles?: SocialProfile[];
  variant?: "light" | "dark";
}

const PLATFORM_ICONS = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  YouTube: YouTubeIcon,
} as const;

const ICON_STYLES = "w-4 h-4 text-white  transition-colors";

export function SocialMediaButtons({
  socialProfiles = [],
  variant = "light",
}: SocialMediaButtonsProps) {
  const validProfiles = socialProfiles.filter(
    (profile) => profile.url !== null
  );
  if (validProfiles.length === 0) return null;

  return (
    <section className="flex">
      {validProfiles.map(({ url, platform }) => {
        const Icon = PLATFORM_ICONS[platform];
        return (
          <TooltipProvider key={url!}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={url!}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group p-1.5  rounded-md hover:bg-white/10 transition-colors",
                    variant === "dark" && "hover:bg-black/10"
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
