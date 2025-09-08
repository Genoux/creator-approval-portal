import Link from "next/link";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialMediaButtonsProps {
  igProfile?: string | null;
  ttProfile?: string | null;
  ytProfile?: string | null;
}

const PLATFORMS = [
  { key: "igProfile" as const, Icon: InstagramIcon, platform: "Instagram" },
  { key: "ttProfile" as const, Icon: TikTokIcon, platform: "TikTok" },
  { key: "ytProfile" as const, Icon: YouTubeIcon, platform: "YouTube" },
] as const;

const ICON_STYLES = "w-4 h-4 text-white  transition-colors";

export function SocialMediaButtons({
  igProfile,
  ttProfile,
  ytProfile,
}: SocialMediaButtonsProps) {
  const profiles = { igProfile, ttProfile, ytProfile };

  const socialProfiles = PLATFORMS.map(({ key, Icon, platform }) => {
    const url = profiles[key];
    if (!url) return null;

    return { url, Icon, platform };
  }).filter(
    (profile): profile is NonNullable<typeof profile> => profile !== null
  );

  if (socialProfiles.length === 0) return null;

  return (
    <section className="flex">
      {socialProfiles.map(({ url, Icon, platform }) => (
        <TooltipProvider key={url}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={url}
                onClick={(e) => e.stopPropagation()}
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
    </section>
  );
}
