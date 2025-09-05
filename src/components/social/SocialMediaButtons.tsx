import Link from "next/link";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import type { CreatorData } from "@/utils/creator-data";
import { extractHandle } from "@/utils/social-media";

interface SocialMediaButtonsProps {
  creatorData: CreatorData;
}

const PLATFORMS = [
  { key: "igProfile", Icon: InstagramIcon, name: "Instagram" },
  { key: "ttProfile", Icon: TikTokIcon, name: "TikTok" },
  { key: "ytProfile", Icon: YouTubeIcon, name: "YouTube" },
] as const;

const ICON_STYLES =
  "w-4 h-4 text-white group-hover:text-white/60 transition-colors";

export function SocialMediaButtons({ creatorData }: SocialMediaButtonsProps) {
  const socialProfiles = PLATFORMS.map(({ key, Icon, name }) => {
    const url = creatorData[key];
    if (!url) return null;

    const handle = extractHandle(url);
    return { url, Icon, name, handle };
  }).filter(
    (profile): profile is NonNullable<typeof profile> => profile !== null
  );

  if (socialProfiles.length === 0) return null;

  return (
    <div className="flex gap-3">
      {socialProfiles.map(({ url, Icon, name, handle }) => (
        <Link
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={`View ${name} profile ${handle || ""}`}
          className="group rounded-md hover:opacity-80 transition-colors"
        >
          <Icon className={ICON_STYLES} />
        </Link>
      ))}
    </div>
  );
}
