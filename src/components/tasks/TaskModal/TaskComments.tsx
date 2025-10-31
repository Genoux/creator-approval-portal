import { ArrowLeftIcon, MessageSquareIcon } from "lucide-react";
import { memo, useState } from "react";
import { CommentSection } from "@/components/comments/CommentSection";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/ui/useIsMobile";
import type { Task } from "@/types";

interface TaskCommentsProps {
  task: Task;
}

function TaskCommentsComponent({ task }: TaskCommentsProps) {
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);
  const isMobile = useIsMobile();

  // Desktop: Show comments sidebar
  if (!isMobile) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <CommentSection taskId={task.id} className="w-auto flex-1" />
      </div>
    );
  }

  // Mobile: Show button + overlay
  return (
    <>
      {!showMobileOverlay && (
        <div className="flex justify-end items-end flex-1 z-50">
          <Button
            onClick={() => setShowMobileOverlay(true)}
            className="rounded-full bg-[#2A0006] hover:bg-[#2A0006]/90 cursor-pointer text-white"
            size="lg"
          >
            <MessageSquareIcon className="w-4 h-4" />
            Comments
          </Button>
        </div>
      )}
      {showMobileOverlay && (
        <div className="absolute inset-0 bg-white z-40 flex flex-col">
          <div className="flex-shrink-0 flex justify-start items-center p-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileOverlay(false)}
              className="h-8 w-8 cursor-pointer rounded-full"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 min-h-0 p-3">
            <CommentSection taskId={task.id} className="h-full" />
          </div>
        </div>
      )}
    </>
  );
}

// Memoize component to prevent unnecessary re-renders when task.id hasn't changed
export const TaskComments = memo(TaskCommentsComponent, (prev, next) => {
  return prev.task.id === next.task.id;
});
