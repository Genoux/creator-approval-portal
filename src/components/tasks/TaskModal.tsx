import { BadgeCheck, Users, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CommentSection } from "@/components/comments/CommentSection";
import { Badge } from "@/components/ui/badge";
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
import { useCreatorProfile } from "@/hooks/creators/useCreatorProfile";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/tasks";
import { isTeamRecommended } from "@/utils/approval";

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
    profileImageUrl,
    socialProfiles,
    followerCount,
    name,
    creatorType,
    gender,
    engagementRate,
    example,
    whyGoodFit,
    sow,
  } = useCreatorProfile(task);
  return (
    <div className={cn(className)}>
      <div className="relative rounded-lg overflow-hidden bg-muted hidde">
        <Image
          src={profileImageUrl || ""}
          alt={`${name} profile`}
          width={300}
          height={300}
          className="object-cover"
        />
      </div>

      <div>
        <h1 className="text-lg font-semibold flex items-center">
          {task.name}
          {isTeamRecommended(task) ? (
            <Tooltip>
              <TooltipTrigger>
                <BadgeCheck className="w-5 h-5 text-green-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Team Recommended</p>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </h1>
      </div>

      {/* Basic Stats */}
      <div className="grid grid-cols-2 gap-4">
        {followerCount && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Followers</p>
              <p className="font-semibold">{followerCount}</p>
            </div>
          </div>
        )}

        {engagementRate && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
              <p className="font-semibold">{engagementRate}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Creator Information */}
      <div className="space-y-4">
        {creatorType && (
          <div>
            <h3 className="font-semibold mb-2">Creator Type</h3>
            <Badge variant="secondary">{creatorType}</Badge>
          </div>
        )}

        {gender && (
          <div>
            <h3 className="font-semibold mb-2">Gender</h3>
            <p className="text-sm text-muted-foreground">{gender}</p>
          </div>
        )}

        {/* Social Media Profiles */}
        {socialProfiles.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Social Media Profiles</h3>
            <div className="space-y-2">
              {socialProfiles.map((profile) => (
                <div
                  key={profile.platform}
                  className="flex items-center justify-between p-2 rounded border"
                >
                  <div>
                    <span className="font-medium">{profile.platform}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {profile.handle}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={profile.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Detailed Information */}
        {whyGoodFit && (
          <div>
            <h3 className="font-semibold mb-2">Why Good Fit</h3>
            <p className="text-sm leading-relaxed">{whyGoodFit}</p>
          </div>
        )}

        {example && (
          <div>
            <h3 className="font-semibold mb-2">Example</h3>
            <p className="text-sm leading-relaxed">{example}</p>
          </div>
        )}

        {sow && (
          <div>
            <h3 className="font-semibold mb-2">Scope of Work</h3>
            <p className="text-sm leading-relaxed">{sow}</p>
          </div>
        )}
      </div>
    </div>
  );
}
