import { Squircle } from "@squircle-js/react";
import { BadgeCheck, ChevronDownIcon, Users } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { SocialMediaButtons } from "@/components/social/SocialMediaButtons";
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
import { useStatusActions } from "@/hooks/creators/useStatusActions";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/tasks";
import {
  getApprovalStatus,
  getDisplayLabel,
  isTeamRecommended,
} from "@/utils/approval";
import { extractCreatorData, formatFollowerCount } from "@/utils/creator-data";
import { useImageColor } from "@/utils/image-color";
import { extractImageUrl } from "@/utils/image-url";
import { extractHandle } from "@/utils/social-media";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { STATUS_OPTIONS, handleStatusChange } = useStatusActions();
  const currentLabel = getApprovalStatus(task);
  const creatorData = extractCreatorData(task);

  // Temporary image
  const profileImageUrl = extractImageUrl(
    creatorData.profileImageUrl ||
      "https://img.freepik.com/free-photo/man-doing-household-tasks_23-2151733167.jpg?semt=ais_hybrid&w=740&q=80"
  );
  const primaryHandle =
    extractHandle(creatorData.ttProfile) ||
    extractHandle(creatorData.igProfile) ||
    extractHandle(creatorData.ytProfile);

  const { gradient } = useImageColor(profileImageUrl);

  function StatusDropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex gap-0.5 border border-white/30 bg-white/10 backdrop-blur-md rounded-3xl text-white hover:bg-white/20 hover:text-white transition-colors focus:ring-0! focus:ring-offset-0 data-[state=open]:ring-0"
          >
            {getDisplayLabel(currentLabel)}
            <ChevronDownIcon
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-lg w-[200px]">
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => {
                if (currentLabel.toString() !== status) {
                  handleStatusChange(task, status);
                }
              }}
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
    <AnimatePresence mode="wait">
      <div
        className="shadow-lg"
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

                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    {creatorData.followerCount && (
                      <div className="flex items-center gap-1.5 text-sm white/90">
                        <Users className="w-4 h-4" />
                        <span>
                          {formatFollowerCount(creatorData.followerCount)}
                        </span>
                      </div>
                    )}
                    <SocialMediaButtons creatorData={creatorData} />
                  </div>
                  <StatusDropdownMenu />
                </div>
              </div>
            </div>
          </div>
        </Squircle>
      </div>
    </AnimatePresence>
  );
}
