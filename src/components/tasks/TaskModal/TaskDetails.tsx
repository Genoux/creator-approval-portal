import { Squircle } from "@squircle-js/react";
import { ImageOffIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { StatusDropdown } from "@/components/shared/StatusDropdown";
import { SocialMediaButtons } from "@/components/social/SocialMediaButtons";
import { SocialPreview } from "@/components/social/SocialPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreatorProfile } from "@/hooks/utils/useCreatorProfile";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/tasks";

interface TaskDetailsProps {
  task: Task;
  className?: string;
}

export function TaskDetails({ task, className }: TaskDetailsProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const {
    avatar,
    primaryHandle,
    primaryProfileUrl,
    socialProfiles,
    followerCount,
    name,
    portfolio,
  } = useCreatorProfile(task);

  function handleImageLoad() {
    setImageLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Avatar */}
      <Squircle
        cornerRadius={18}
        cornerSmoothing={1}
        className="transition-colors w-full h-[350px] overflow-hidden will-change-transform flex-shrink-0"
      >
        <StatusDropdown
          task={task}
          variant="light"
          className="absolute bottom-0 right-0 m-4 z-10 overflow-hidden"
        />
        <div
          className="absolute backdrop-blur-md overflow-hidden w-full h-1/2 bottom-0"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 10%, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0.32) 40%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.82) 70%, rgba(0,0,0,0.92) 80%, rgba(0,0,0,0.98) 90%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 10%, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0.32) 40%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.82) 70%, rgba(0,0,0,0.92) 80%, rgba(0,0,0,0.98) 90%, black 100%)",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.01) 10%, rgba(0,0,0,0.04) 20%, rgba(0,0,0,0.09) 30%, rgba(0,0,0,0.16) 40%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.36) 60%, rgba(0,0,0,0.49) 70%, rgba(0,0,0,0.64) 80%, rgba(0,0,0,0.81) 90%, rgba(0,0,0,0.9) 100%)",
          }}
        ></div>
        {avatar && imageLoading && (
          <Skeleton className="absolute w-full h-full z-90" />
        )}
        {avatar ? (
          <Image
            src={avatar}
            alt={`${name} profile`}
            width={800}
            height={800}
            className="object-cover w-full h-full"
            onLoadingComplete={handleImageLoad}
          />
        ) : (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <ImageOffIcon className=" text-white" />
          </div>
        )}
      </Squircle>
      <section className="flex flex-col  flex-1 gap-4">
        {/* Task Details */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1 ">
            <h1 className="text-lg font-semibold flex items-center leading-none">
              {task.name}
            </h1>
            <Link
              href={primaryProfileUrl || ""}
              className="text-xs text-black/50 hover:underline w-fit"
              target="_blank"
            >
              {primaryHandle}
            </Link>
          </div>
          {followerCount && (
            <div className="flex flex-col justify-end items-end">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs text-black/50">Followers</span>
              </div>
              <p className="text-sm font-semibold">{followerCount}</p>
            </div>
          )}
        </div>

        {/* Why Good Fit */}
        {portfolio.whyGoodFit && (
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs text-black/50">About</span>
            </div>
            <p className="text-sm text-black/80">{portfolio.whyGoodFit}</p>
          </div>
        )}

        <div className="flex flex-col rounded-xl overflow-hidden flex-1 gap-2">
          <div className="flex gap-1 w-full items-center justify-between">
            <h3 className="text-base font-semibold">Content</h3>
            {socialProfiles.length > 0 && (
              <div className="flex gap-2">
                <SocialMediaButtons
                  variant="dark"
                  socialProfiles={socialProfiles}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 overflow-auto">
            {portfolio.example && (
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <SocialPreview url={portfolio.example} />
                </div>
              </div>
            )}
            {portfolio.example && (
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <SocialPreview
                    type="inbeat"
                    title="InBeat Portfolio"
                    url={portfolio.example}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
