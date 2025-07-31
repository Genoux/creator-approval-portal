import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTaskActions } from "@/hooks/tasks/useTaskActions";
import { useTaskStatus } from "@/hooks/tasks/useTaskStatus";
import type { Task } from "@/types/tasks";
import { TaskActionsDropdown } from "./TaskActionsDropdown";
import { TaskDetailDialog } from "./TaskDetailDialog";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { handleApprove, handleDecline } = useTaskActions();
  const { currentStatus } = useTaskStatus(task);
  const [showDetails, setShowDetails] = useState(false);

  // Define button configurations based on status
  const getButtonConfig = () => {
    const baseConfig = {
      approve: {
        icon: CheckIcon,
        label: "Approve",
        onClick: handleApprove,
        variant: "secondary" as const,
      },
      decline: {
        icon: XIcon,
        label: "Decline",
        onClick: handleDecline,
        variant: "outline" as const,
      },
    };

    switch (currentStatus) {
      case "Declined":
        return [baseConfig.approve];
      case "Accepted":
        return [baseConfig.decline];
      default: // Review
        return [baseConfig.approve, baseConfig.decline];
    }
  };

  const buttons = getButtonConfig();

  return (
    <>
      <Card className="group transition-colors flex flex-col gap-2">
        <CardHeader className="flex flex-row items-end justify-end">
          <TaskActionsDropdown
            task={task}
            currentStatus={currentStatus}
            onViewDetails={() => setShowDetails(true)}
          />
        </CardHeader>
        <CardContent className="pb-4 flex flex-col items-center gap-2 flex-1">
          <Avatar className="w-15 h-15">
            <AvatarImage src="" />
            <AvatarFallback className="bg-accent-foreground text-white">
              {task.name
                .replace(/^\[TEST\]\s*/, "")
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-base leading-tight">
            {task.name.replace(/^\[TEST\]\s*/, "")}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex gap-2">
          {buttons.map(button => {
            const Icon = button.icon;
            return (
              <Button
                key={button.label}
                size="sm"
                variant={button.variant}
                onClick={e => {
                  e.stopPropagation();
                  button.onClick(task);
                }}
                className="flex-1 shadow-none"
              >
                <Icon />
                {button.label}
              </Button>
            );
          })}
        </CardFooter>
      </Card>

      <TaskDetailDialog
        task={task}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
}
