import { Squircle } from "@squircle-js/react";
import { ImageOffIcon } from "lucide-react";
import Image from "next/image";
import { useGetStatusConfirmation } from "@/contexts/StatusConfirmationContext";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { getDisplayLabel, isRecentlyAdded } from "@/utils/ui";
import { StatusDropdown } from "../shared/StatusDropdown";
import { Badge } from "../ui/badge";
import { CardDescription, CardTitle } from "../ui/card";

interface TaskSquircleProps {
  task: Task;
  size?: "default" | "modal";
}

export function TaskSquircle({ task, size = "default" }: TaskSquircleProps) {
  const { title, thumbnail, socials, date_created, status } = task;
  const isReadOnly = useGetStatusConfirmation() === null;
  const showRecentBadge =
    status.label === "For Review" && isRecentlyAdded(date_created);
  return (
    <div>
      <Squircle
        cornerRadius={16}
        cornerSmoothing={1}
        className={cn(
          "transition-colors w-full overflow-hidden will-change-transform flex-shrink-0 h-[400px]",
          size === "modal" && "h-[350px]"
        )}
      >
        {/* Background Image */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl overflow-hidden",
            size === "default" ? "h-full" : "h-[350px]"
          )}
        >
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={`${title} profile`}
              width={800}
              height={800}
              placeholder="blur"
              priority
              blurDataURL={thumbnail}
              className="flex items-center justify-center object-cover w-full h-full object-center bg-black/10"
              loading="eager"
            />
          ) : (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <ImageOffIcon className=" text-black/50" />
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[150px] pointer-events-none bg-gradient-to-b from-transparent via-black/70 to-black"></div>

        {/* Recently Added Badge */}
        {showRecentBadge && (
          <div className="absolute top-3 left-3 pointer-events-none z-10">
            <Badge
              variant="outline"
              className="bg-green-500/50 rounded-full border-white/10 backdrop-blur-sm text-white font-semibold"
            >
              New
            </Badge>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-2 flex self-end flex-wrap justify-between gap-2 p-3 text-white items-end">
          <div className="flex flex-col">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg font-semibold flex items-center leading-none">
                {title}
              </CardTitle>

              <CardDescription className="text-white/80 text-sm">
                <p>{socials[0]?.handle}</p>
              </CardDescription>
            </div>
          </div>
          {isReadOnly ? (
            <div className="flex items-center gap-2">
              <Badge className="border-white/10 bg-white/10 backdrop-blur-md rounded-3xl text-white px-2 py-1">
                {getDisplayLabel(status.label)}
              </Badge>
            </div>
          ) : (
            <StatusDropdown task={task} variant="light" />
          )}
        </div>
      </Squircle>
    </div>
  );
}
