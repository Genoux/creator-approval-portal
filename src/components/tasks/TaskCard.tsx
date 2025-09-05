import {
  BadgeCheck,
  ChevronDownIcon,
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
  CircleXIcon,
  ThumbsUpIcon,
  Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { SocialMediaButtons } from "@/components/social/SocialMediaButtons";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
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
import { useCreatorActions } from "@/hooks/creators/useCreatorActions";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/tasks";
import {
  APPROVAL_LABELS,
  getApprovalStatus,
  isTeamRecommended,
} from "@/utils/approval";
import { extractCreatorData, formatFollowerCount } from "@/utils/creator-data";
import { extractImageUrl } from "@/utils/image-url";
import { extractHandle } from "@/utils/social-media";

interface TaskCardProps {
  task: Task;
}

// Define status actions and derive options from it
const STATUS_ACTIONS = {
  [APPROVAL_LABELS.PERFECT]: (
    task: Task,
    actions: ReturnType<typeof useCreatorActions>
  ) => actions.handleApprove(task),
  [APPROVAL_LABELS.GOOD]: (
    task: Task,
    actions: ReturnType<typeof useCreatorActions>
  ) => actions.handleGood(task),
  [APPROVAL_LABELS.SUFFICIENT]: (
    task: Task,
    actions: ReturnType<typeof useCreatorActions>
  ) => actions.handleBackup(task),
  [APPROVAL_LABELS.POOR_FIT]: (
    task: Task,
    actions: ReturnType<typeof useCreatorActions>
  ) => actions.handleDecline(task),
  [APPROVAL_LABELS.FOR_REVIEW]: (
    task: Task,
    actions: ReturnType<typeof useCreatorActions>
  ) => actions.handleMoveToReview(task),
} as const;

const STATUS_OPTIONS = Object.keys(STATUS_ACTIONS) as Array<
  keyof typeof STATUS_ACTIONS
>;

export function TaskCard({ task }: TaskCardProps) {
  const creatorActions = useCreatorActions();
  const currentLabel = getApprovalStatus(task);
  const creatorData = extractCreatorData(task);
  const profileImageUrl = extractImageUrl(
    creatorData.profileImageUrl ||
      "https://s2.imginn.com/post529452331_18518223043059787_5939114518899576111_n.jpg?t51.2885-15/529452331_18518223043059787_5939114518899576111_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDgweDE0NDAuc2RyLmY4Mjc4Ny5kZWZhdWx0X2ltYWdlLmMyIn0&_nc_ht=scontent-atl3-3.cdninstagram.com&_nc_cat=107&_nc_oc=Q6cZ2QFTCOpnQT5m2kKWc1bQXZT448i-06pOggHp-vkFJvVSN1tWQOQD278f2gmtxc_daT5gUyrJTPaUay4QdfK5Ru7f&_nc_ohc=5bao35_3wIEQ7kNvwGFPoil&_nc_gid=LiJk12v8-iaWh4FOwFG6iQ&edm=ANTKIIoBAAAA&ccb=7-5&oh=00_Afa5q10xglmNzMaUUjsSkSDK5DjY203vH1YBo5re1x31Xw&oe=68C0DAC4&_nc_sid=d885a2"
  );
  const primaryHandle =
    extractHandle(creatorData.ttProfile) ||
    extractHandle(creatorData.igProfile) ||
    extractHandle(creatorData.ytProfile);

  function handleStatusChange(status: string) {
    const actionFn = STATUS_ACTIONS[status as keyof typeof STATUS_ACTIONS];
    if (actionFn) {
      actionFn(task, creatorActions);
    }
  }

  function getStatusIcon(status: string) {
    const iconMap: Record<
      string,
      React.ComponentType<{ className?: string }>
    > = {
      [APPROVAL_LABELS.PERFECT]: CircleCheckIcon,
      [APPROVAL_LABELS.GOOD]: ThumbsUpIcon,
      [APPROVAL_LABELS.SUFFICIENT]: CircleIcon,
      [APPROVAL_LABELS.POOR_FIT]: CircleXIcon,
    };

    const IconComponent = iconMap[status] || CircleHelpIcon;
    return <IconComponent className="w-4 h-4" />;
  }

  function StatusDropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex gap-0.5 border border-white/30 bg-white/10 backdrop-blur-md rounded-3xl text-white hover:bg-white/20 hover:text-white transition-colors focus:ring-0! focus:ring-offset-0 data-[state=open]:ring-0"
          >
            Status
            <ChevronDownIcon
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-lg w-[220px]">
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => {
                if (currentLabel.toString() !== status) {
                  handleStatusChange(status);
                }
              }}
              className={cn(
                "flex items-center gap-2",
                currentLabel.toString() === status
                  ? "bg-gray-100 cursor-default"
                  : "cursor-pointer"
              )}
            >
              {getStatusIcon(status)}
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Card className="transition-colors relative h-[500px] rounded-3xl overflow-hidden p-2">
      {/* Background Image */}
      <div className="absolute inset-2 rounded-2xl overflow-hidden border border-black/10">
        <Image src={profileImageUrl || ""} alt={`${task.name} profile`} fill />
      </div>
      {/* Gradient Blur Overlay */}
      <div
        className="absolute inset-2 backdrop-blur-lg rounded-2xl overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 80%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 80%)",
        }}
      ></div>

      {/* Subtle Dark Gradient Overlay */}
      <div className="absolute inset-2 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-black/40"></div>

      {/* Content Overlay */}
      <div className="absolute inset-2 flex flex-col justify-between p-4 text-white rounded-lg">
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

            <div className="flex justify-between items-center mt-2">
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
    </Card>
  );
}
