"use client";

import { useTaskComments } from "@/hooks/data/comments/useTaskComments";
import { useScrollToBottom } from "@/hooks/ui/useScrollToBottom";
import { cn } from "@/lib/utils";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface CommentSectionProps {
  taskId: string;
  className?: string;
}

export function CommentSection({ taskId, className }: CommentSectionProps) {
  const { data: comments = [], isLoading, error } = useTaskComments(taskId);
  const { scrollRef, scrollToBottom } = useScrollToBottom();

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-2xl pb-4 pt-3 bg-[#F9F7F7] w-fit flex-0 min-w-[500px] max-w-[500px]",
        className
      )}
    >
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

      {/* Comments List */}
      <div className="flex-1 flex flex-col pl-4 pr-2">
        {error ? (
          <div className="text-center text-destructive p-8">
            <p>Failed to load comments</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        ) : (
          <CommentList
            comments={comments}
            isLoading={isLoading}
            scrollRef={scrollRef}
            onCommentsChange={scrollToBottom}
          />
        )}
      </div>

      {/* Comment Form */}
      <div className="px-4">
        <CommentForm taskId={taskId} onCommentSent={scrollToBottom} />
      </div>
    </div>
  );
}
