//TODO: Split into smaller components

import { Squircle } from "@squircle-js/react";
import {
  ArrowLeftIcon,
  BadgeCheck,
  MessageSquareIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CommentSection } from "@/components/comments/CommentSection";
import { SocialMediaButtons } from "@/components/social/SocialMediaButtons";
import { SocialPreview } from "@/components/social/SocialPreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useTaskComments } from "@/hooks/data/comments/useTaskComments";
import { useCreatorProfile } from "@/hooks/utils/useCreatorProfile";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/tasks";

interface TaskModalProps {
  task: Task;
  children: React.ReactNode;
}

export function TaskModal({ task, children }: TaskModalProps) {
  const [open, setOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { data: comments = [], isLoading } = useTaskComments(task.id);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent
          showCloseButton={false}
          className="rounded-3xl w-full md:!max-w-4xl px-4 pb-4 pt-3 h-[764px] transition-none md:min-h-[400px] max-h-full overflow-hidden flex flex-col"
        >
          <DialogTitle className="sr-only">{task.name}</DialogTitle>

          <section className="flex flex-col md:flex-row justify-between gap-4 min-h-0 flex-1 overflow-hidden">
            <TaskDetails
              task={task}
              className="flex-1 overflow-y-auto sm:p-4 p-0"
            />

            {/* Desktop Comments - Always visible on md+ */}
            <CommentSection
              taskId={task.id}
              className="w-auto flex-1 hidden md:flex"
            />

            {/* Mobile Comments - Overlay */}
            {showComments && (
              <div className="absolute inset-0 bg-white z-40 flex flex-col md:hidden">
                <div className="flex justify-between items-center p-4 border-b">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowComments(false)}
                    className="h-8 w-8"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                  </Button>
                  {/* Header */}
                  {comments.length > 0 && (
                    <div className="px-4">
                      <div className="flex items-center gap-1">
                        <h3 className="text-base font-semibold">Comments</h3>
                        {!isLoading && (
                          <span className="text-sm text-muted-foreground">
                            ({comments.length})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-3">
                  <CommentSection
                    taskId={task.id}
                    className="flex-1 h-full"
                    showHeader={false}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Mobile Message Button - Only visible on mobile when comments are hidden */}
          {!showComments && (
            <Button
              onClick={() => setShowComments(true)}
              className="md:hidden rounded-full bg-[#2A0006] hover:bg-[#2A0006]/90 cursor-pointer text-white"
              size="lg"
            >
              <MessageSquareIcon className="w-4 h-4" />
              Comments
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {open && (
        <Button
          className="fixed top-4 right-4 rounded-full h-fit w-fit px-2.5 pt-2.5 pb-2 cursor-pointer z-60"
          onClick={() => setOpen(false)}
          variant="ghost"
          size="icon"
        >
          <XIcon className="w-6 h-6 text-white" />
        </Button>
      )}
    </>
  );
}

function TaskDetails({ task, className }: { task: Task; className?: string }) {
  const [imageLoading, setImageLoading] = useState(true);
  const {
    avatar,
    primaryHandle,
    primaryProfileUrl,
    socialProfiles,
    followerCount,
    name,
    type: creatorType,
    portfolio,
  } = useCreatorProfile(task);

  function handleImageLoad() {
    setImageLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Avatar */}
      <Squircle
        cornerRadius={18}
        cornerSmoothing={1}
        className="mb-2 transition-colors w-full h-[300px] overflow-hidden will-change-transform flex-shrink-0"
      >
        {imageLoading && <Skeleton className="absolute w-full h-full z-90" />}
        <Image
          src={avatar || ""}
          alt={`${name} profile`}
          width={500}
          height={500}
          className="object-cover w-full h-full"
          onLoadingComplete={handleImageLoad}
        />
      </Squircle>

      {/* Task Details */}
      <div className="flex flex-col gap-1">
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

      {/* Why Good Fit */}
      {portfolio.whyGoodFit && (
        <p className="text-sm text-black/80">{portfolio.whyGoodFit}</p>
      )}

      {/* Stats */}
      <div>
        {followerCount && (
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs text-black/50">Followers</span>
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
      {/* Content Sections */}
      {portfolio.example && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-1 w-full items-center justify-between border-t pt-4 mt-4">
            <h3 className="text-base font-semibold">Example</h3>
            {/* Social Profiles */}
            {socialProfiles.length > 0 && (
              <div className="flex gap-2">
                <SocialMediaButtons
                  variant="dark"
                  socialProfiles={socialProfiles}
                />
              </div>
            )}
          </div>
          <div className="w-full">
            <SocialPreview url={portfolio.example} />
          </div>
        </div>
      )}
    </div>
  );
}
