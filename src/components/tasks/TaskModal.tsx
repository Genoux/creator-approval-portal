import { BadgeCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { useCreatorProfile } from "@/hooks/creators/useCreatorProfile";
import type { Task } from "@/types/tasks";
import { isTeamRecommended } from "@/utils/approval";

interface TaskModalProps {
  task: Task;
  children: React.ReactNode;
}

export function TaskModal({ task, children }: TaskModalProps) {
  const { profileImageUrl, primaryHandle, name } = useCreatorProfile(task);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-[1280px] !h-[calc(100vh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={profileImageUrl}
                alt={`${task.name} profile`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                {name}
                {isTeamRecommended(task) && (
                  <BadgeCheck className="w-5 h-5 text-green-500" />
                )}
              </div>
              {primaryHandle && (
                <span className="text-sm text-muted-foreground font-normal">
                  {primaryHandle}
                </span>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        <section className="grid grid-cols-6 gap-4">
          <TaskDetails task={task} />
          <CommentSection />
        </section>
      </DialogContent>
    </Dialog>
  );
}

function CommentSection() {
  return <div>CommentSection</div>;
}

function TaskDetails({ task }: { task: Task }) {
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
    <div className="col-span-3 border border-green-600">
      {/* Profile Image */}
      <div className="relative rounded-lg overflow-hidden bg-muted">
        <Image
          src={profileImageUrl}
          alt={`${name} profile`}
          width={512}
          height={512}
          className="object-cover"
        />
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
