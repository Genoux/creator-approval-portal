import { Squircle } from "@squircle-js/react";
import { BadgeCheck, ChevronDownIcon, Users } from "lucide-react";
import { motion } from "motion/react";
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
import { Image } from "@/components/ui/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCreatorProfile } from "@/hooks/creators/useCreatorProfile";
import { useStatusActions } from "@/hooks/creators/useStatusActions";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/tasks";
import {
  getApprovalStatus,
  getDisplayLabel,
  isTeamRecommended,
} from "@/utils/approval";
import { useImageColor } from "@/utils/image-color";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { STATUS_OPTIONS, handleStatusChange, isPending } = useStatusActions();
  const currentLabel = getApprovalStatus(task);

  // Get creator profile (this will be stable for the same task ID/name)
  const {
    profileImageUrl,
    primaryHandle,
    followerCount,
    igProfile,
    ttProfile,
    ytProfile,
  } = useCreatorProfile(task);

  const { gradient } = useImageColor(profileImageUrl);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleStatusClick = (status: string) => {
    if (currentLabel.toString() !== status && !isPending) {
      handleStatusChange(task, status);
    }
  };

  function StatusDropdownMenu() {
    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={isPending}
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
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusClick(status);
              }}
              disabled={isPending}
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
      <div
        className="shadow-lg cursor-pointer"
        style={{
          boxShadow:
            "0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.12)",
          borderRadius: "24px",
        }}
      >
        <Squircle
          cornerRadius={24}
          cornerSmoothing={1}
          className="transition-colors relative h-[500px] overflow-hidden will-change-transform"
        >
          {/* Background Image */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden ">
            <Image
              src={profileImageUrl || ""}
              alt={`${task.name} profile`}
              fill
            />
          </div>
          <div
            className="absolute inset-0 backdrop-blur-lg rounded-2xl overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 80%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 80%)",
            }}
          ></div>
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ background: gradient }}
          ></div>

          {/* Content Overlay */}
          <div className="absolute inset-2 flex flex-col justify-between p-3 text-white">
            {/* Empty top space */}
            <div></div>

            {/* Bottom Content */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
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
                    <SocialMediaButtons
                      igProfile={igProfile}
                      ttProfile={ttProfile}
                      ytProfile={ytProfile}
                    />
                  </div>
                  <StatusDropdownMenu />
                </motion.div>
              </div>
            </div>
          </div>
        </Squircle>
      </div>
    </TaskModal>
  );
}
