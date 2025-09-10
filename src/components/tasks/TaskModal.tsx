import { BadgeCheck, Users, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CommentSection } from "@/components/comments/CommentSection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCreatorProfile } from "@/hooks/utils/useCreatorProfile";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/tasks";
import { isTeamRecommended } from "@/utils/approval";
import { MediaEmbed } from "../social/MediaEmbed";
import { SocialMediaButtons } from "../social/SocialMediaButtons";

interface TaskModalProps {
  task: Task;
  children: React.ReactNode;
}

export function TaskModal({ task, children }: TaskModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="!max-w-[1280px] px-4 pb-4 pt-3"
      >
        <DialogTitle className="sr-only">{task.name}</DialogTitle>
        <div className="flex justify-end w-full ">
          <Button
            className="rounded-full h-fit w-fit px-2.5 pt-2.5 pb-2 cursor-pointer "
            onClick={() => setOpen(false)}
            variant="secondary"
            size="icon"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>

        <section className="flex justify-between gap-4  !h-[800px] ">
          <TaskDetails task={task} className="flex-1 w-full" />
          <CommentSection taskId={task.id} className="" />
        </section>
      </DialogContent>
    </Dialog>
  );
}

function TaskDetails({ task, className }: { task: Task; className?: string }) {
  const {
    avatar,
    socialProfiles,
    followerCount,
    name,
    type: creatorType,
    portfolio,
  } = useCreatorProfile(task);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header Section */}
      <div className="flex flex-col items-start gap-3">
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src={avatar || ""}
            alt={`${name} profile`}
            width={250}
            height={250}
            className="object-cover w-full h-full"
          />
        </div>
        <h1 className="text-lg font-semibold flex items-center gap-2 mb-1">
          {task.name}
          {isTeamRecommended(task) && (
            <Tooltip>
              <TooltipTrigger>
                <BadgeCheck className="w-4 h-4 text-green-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Team Recommended</p>
              </TooltipContent>
            </Tooltip>
          )}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="flex gap-2">
        {followerCount && (
          <div className="p-2 rounded-md bg-muted/20">
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Follower Count
              </span>
            </div>
            <p className="text-sm font-semibold">{followerCount}</p>
          </div>
        )}

        {creatorType && (
          <div className="p-2 rounded-md bg-muted/20">
            <div className="flex items-center gap-1.5 mb-1">
              <BadgeCheck className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Creator Type
              </span>
            </div>
            <p className="text-sm font-semibold">{creatorType}</p>
          </div>
        )}
      </div>

      {/* Social Profiles */}
      {socialProfiles.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Social Profiles
          </h3>
          <div className="flex gap-2">
            <SocialMediaButtons
              variant="dark"
              socialProfiles={socialProfiles}
            />
          </div>
        </div>
      )}

      <Separator className="my-3" />

      {/* Content Sections */}
      <div className="space-y-3">
        {portfolio.whyGoodFit && (
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
              Why Good Fit
            </h3>
            <p className="text-xs leading-relaxed text-foreground/90">
              {portfolio.whyGoodFit}
            </p>
          </div>
        )}

        {portfolio.example && (
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
              Example
              {portfolio.example.toString()}
            </h3>
            <MediaEmbed url={portfolio.example} />
          </div>
        )}

        {portfolio.sow && (
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
              Scope of Work
            </h3>
            <p className="text-xs leading-relaxed text-foreground/90">
              {portfolio.sow}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
