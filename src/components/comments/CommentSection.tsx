"use client";

import { useTaskComments } from "@/hooks/data/comments/useTaskComments";
import { useScrollToBottom } from "@/hooks/ui/useScrollToBottom";
import { cn } from "@/lib/utils";
import { ErrorBlock } from "../shared/ErrorBlock";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface CommentSectionProps {
  taskId: string;
  className?: string;
  showHeader?: boolean;
}

export function CommentSection({ taskId, className, showHeader = true }: CommentSectionProps) {
  const { data: comments = [], isLoading, error } = useTaskComments(taskId);
  const { scrollRef, scrollToBottom } = useScrollToBottom();

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl pb-4 pt-3 bg-[#F9F7F7] min-h-0",
        className
      )}
    >
      {/* Header */}
      {showHeader && comments.length > 0 && (
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

      {/* Comments List */}
      <div className="flex-1 flex flex-col pl-4 pr-2 h-full">
        {error ? (
          <ErrorBlock
            title="Error loading comments"
            description="Please try again later or contact support."
            actionText="Retry"
          />
        ) : (
          <CommentList
            comments={comments}
            isLoading={isLoading}
            scrollRef={scrollRef}
            onCommentsChange={scrollToBottom}
          />
        )}
      </div>

      <CommentForm taskId={taskId} onCommentSent={scrollToBottom} />
    </div>
  );
}
