import { ArrowLeftIcon } from "lucide-react";
import { CommentSection } from "@/components/comments/CommentSection";
import { Button } from "@/components/ui/button";
import type { ClickUpComment } from "@/types/comments";

interface Comment
  extends Omit<
    ClickUpComment,
    | "comment"
    | "comment_text"
    | "user"
    | "assignee"
    | "assigned_by"
    | "reactions"
    | "date"
  > {
  taskId: string;
}

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
  isLoading: boolean;
  onClose: () => void;
}

export function TaskComments({
  taskId,
  comments,
  isLoading,
  onClose,
}: TaskCommentsProps) {
  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col md:hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 cursor-pointer rounded-full"
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
          taskId={taskId}
          className="flex-1 h-full"
          showHeader={false}
        />
      </div>
    </div>
  );
}
