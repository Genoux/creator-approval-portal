import Link from "next/link";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CreatorData } from "@/utils/creator-data";

interface SocialMediaButtonsProps {
  creatorData: CreatorData;
}

const PLATFORMS = [
  { key: "igProfile", Icon: InstagramIcon, platform: "Instagram" },
  { key: "ttProfile", Icon: TikTokIcon, platform: "TikTok" },
  { key: "ytProfile", Icon: YouTubeIcon, platform: "YouTube" },
] as const;

const ICON_STYLES = "w-4 h-4 text-white  transition-colors";

export function SocialMediaButtons({ creatorData }: SocialMediaButtonsProps) {
  const socialProfiles = PLATFORMS.map(({ key, Icon, platform }) => {
    const url = creatorData[key];
    if (!url) return null;

    return { url, Icon, platform };
  }).filter(
    (profile): profile is NonNullable<typeof profile> => profile !== null
  );

  if (socialProfiles.length === 0) return null;

  return (
    <div className="flex">
      {socialProfiles.map(({ url, Icon, platform }) => (
        <TooltipProvider key={url}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-1.5  rounded-md hover:bg-white/10 transition-colors"
              >
                <Icon className={ICON_STYLES} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>{platform}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
