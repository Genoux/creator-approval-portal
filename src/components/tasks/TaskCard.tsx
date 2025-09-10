import { Squircle } from "@squircle-js/react";
import { ChevronDownIcon, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { SocialMediaButtons } from "@/components/social/SocialMediaButtons";
import { TaskModal } from "@/components/tasks/TaskModal";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskActions } from "@/contexts/TaskActionsContext";
import { useCreatorProfile } from "@/hooks/utils/useCreatorProfile";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/tasks";
import { APPROVAL_LABELS, getApprovalStatus, getDisplayLabel } from "@/utils";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    handleApprove,
    handleGood,
    handleBackup,
    handleDecline,
    handleMoveToReview,
    isTaskPending,
  } = useTaskActions();
  const currentLabel = getApprovalStatus(task);

  // Create status options array and action mapping
  const STATUS_OPTIONS = Object.values(APPROVAL_LABELS);
  const STATUS_ACTIONS = {
    [APPROVAL_LABELS.PERFECT]: handleApprove,
    [APPROVAL_LABELS.GOOD]: handleGood,
    [APPROVAL_LABELS.SUFFICIENT]: handleBackup,
    [APPROVAL_LABELS.POOR_FIT]: handleDecline,
    [APPROVAL_LABELS.FOR_REVIEW]: handleMoveToReview,
  } as const;

  // Get creator profile (this will be stable for the same task ID/name)
  const { avatar, primaryHandle, followerCount, socialProfiles } =
    useCreatorProfile(task);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleStatusClick = (status: string) => {
    if (currentLabel.toString() !== status && !isTaskPending(task.id)) {
      const actionFn = STATUS_ACTIONS[status as keyof typeof STATUS_ACTIONS];
      if (actionFn) {
        actionFn(task);
      }
    }
  };

  function StatusDropdownMenu() {
    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={isTaskPending(task.id)}
            className="flex gap-0.5 border border-white/30 bg-white/10 backdrop-blur-md rounded-3xl text-white hover:bg-white/20 hover:text-white transition-colors focus:ring-0! focus:ring-offset-0 data-[state=open]:ring-0 disabled:opacity-50"
          >
            {getDisplayLabel(currentLabel)}
            <ChevronDownIcon
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isDropdownOpen && "rotate-180"
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {STATUS_OPTIONS.map(status => (
            <DropdownMenuItem
              key={status}
              onClick={e => {
                e.stopPropagation();
                handleStatusClick(status);
              }}
              disabled={isTaskPending(task.id)}
              className={cn(
                "flex items-center gap-2",
                currentLabel.toString() === status
                  ? "bg-black/5 cursor-default"
                  : "cursor-pointer"
              )}
            >
              {getDisplayLabel(status)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <TaskModal task={task}>
      <div className="cursor-pointer rounded-3xl">
        <Squircle
          cornerRadius={24}
          cornerSmoothing={1}
          className="transition-colors relative h-[500px] overflow-hidden will-change-transform"
        >
          {/* Background Image */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden ">
            <Image
              src={avatar || ""}
              alt={`${task.name} profile`}
              fill
              sizes="100%"
              className="object-cover"
              priority
              loading="eager"
              placeholder="blur"
              blurDataURL={avatar || ""}
            />
          </div>
          <div
            className="absolute  backdrop-blur-md overflow-hidden w-full h-full bottom-0"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 10%, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0.32) 40%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.82) 70%, rgba(0,0,0,0.92) 80%, rgba(0,0,0,0.98) 90%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 10%, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0.32) 40%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.82) 70%, rgba(0,0,0,0.92) 80%, rgba(0,0,0,0.98) 90%, black 100%)",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.01) 10%, rgba(0,0,0,0.04) 20%, rgba(0,0,0,0.09) 30%, rgba(0,0,0,0.16) 40%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.36) 60%, rgba(0,0,0,0.49) 70%, rgba(0,0,0,0.64) 80%, rgba(0,0,0,0.81) 90%, rgba(0,0,0,0.9) 100%)",
            }}
          ></div>

          {/* Content Overlay */}
          <div className="absolute inset-2 flex flex-col justify-between p-3 text-white">
            {/* Empty top space */}
            <div></div>

            {/* Bottom Content */}
            <div className="flex flex-col">
              <CardTitle className="text-lg font-semibold flex items-center">
                {task.name}
              </CardTitle>

              <CardDescription className="text-white/80 text-base">
                {primaryHandle}
              </CardDescription>

              <motion.div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  {followerCount && (
                    <div className="flex items-center gap-1.5 text-sm white/90">
                      <Users className="w-4 h-4" />
                      <span>{followerCount}</span>
                    </div>
                  )}
                  <SocialMediaButtons socialProfiles={socialProfiles} />
                </div>
                <StatusDropdownMenu />
              </motion.div>
            </div>
          </div>
        </Squircle>
      </div>
    </TaskModal>
  );
}
