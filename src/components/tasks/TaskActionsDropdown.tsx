import { Cat, Ellipsis, FolderDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskActions } from "@/hooks/tasks/useTaskActions";
import type { Task } from "@/types/tasks";
import { Button } from "../ui/button";

interface TaskActionsDropdownProps {
  task: Task;
  currentStatus: string;
  onViewDetails: () => void;
}

export function TaskActionsDropdown({
  task,
  currentStatus,
  onViewDetails,
}: TaskActionsDropdownProps) {
  const { handleMoveToReview, isPending } = useTaskActions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          onClick={e => e.stopPropagation()}
          disabled={isPending}
        >
          <Ellipsis className="h-3 w-3" />
          <span className="sr-only">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-lg">
        <DropdownMenuItem
          onClick={e => {
            e.stopPropagation();
            onViewDetails();
          }}
        >
          <Cat />
          <span className="text-base">Details</span>
        </DropdownMenuItem>
        {(currentStatus === "Accepted" || currentStatus === "Declined") && (
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation();
              handleMoveToReview(task);
            }}
            disabled={isPending}
          >
            <FolderDown />
            <span className="text-base">Move to review</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
