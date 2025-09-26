import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { ErrorBlock } from "@/components/shared/ErrorBlock";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Comment } from "@/types";

function parseCommentDate(dateInput: string): Date {
  return new Date(Number(dateInput));
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onCommentsChange?: () => void;
}

export function CommentList({
  comments,
  isLoading,
  scrollRef,
  onCommentsChange,
}: CommentListProps) {
  useEffect(() => {
    if (!isLoading && comments.length > 0 && onCommentsChange) {
      onCommentsChange();
    }
  }, [comments, isLoading, onCommentsChange]);

  if (isLoading) {
    return <CommentListSkeleton />;
  }

  return (
    <div className="relative h-full">
      <div className="h-4 absolute top-0 left-0 right-0 w-full bg-gradient-to-b from-[#F9F7F7] to-transparent pointer-events-none z-10"></div>
      <div className="h-6 absolute bottom-0 left-0 right-0 w-full bg-gradient-to-t from-[#F9F7F7] to-transparent pointer-events-none z-10"></div>
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto relative pt-2 pr-4 pl-1.5"
      >
        {comments.length === 0 ? (
          <ErrorBlock
            title="No comments yet"
            description="Comments will appear here"
            icon={<MessageCircle className="w-6 h-6 opacity-40" />}
            className="h-full border-none shadow-none absolute top-0 left-0 right-0 bottom-0"
          />
        ) : (
          <div className="space-y-2 pt-1 pb-4">
            <div className="w-full flex flex-col gap-2">
              {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const createdAt = parseCommentDate(comment.createdAt);
  const timeAgo = formatTimeAgo(createdAt);

  return (
    <div className="border rounded-lg px-4 py-2 space-y-3 w-full bg-white/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {comment.author.initials}
          </div>
          <div>
            <p className="text-sm font-medium">{comment.author.name}</p>
            <p className="text-xs text-muted-foreground" title={timeAgo}>
              {timeAgo}
            </p>
          </div>
        </div>
        {comment.resolved && (
          <Badge variant="secondary" className="text-xs">
            Resolved
          </Badge>
        )}
      </div>
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {comment.text}
      </div>
    </div>
  );
}

function CommentListSkeleton() {
  return (
    <div className="pt-2 pr-4 pl-1.5">
      <div className="space-y-2">
        {Array.from({ length: 2 }).map(() => (
          <div
            key={Math.random()}
            className="border border-black/5 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full bg-black/5" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20 bg-black/5" />
                <Skeleton className="h-3 w-16 bg-black/5" />
              </div>
            </div>
            <Skeleton className="h-16 w-full bg-black/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
