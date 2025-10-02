import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Edit3, MessageCircle, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorBlock } from "@/components/shared/ErrorBlock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/contexts/AuthContext";
import { useCommentActions } from "@/hooks/data/comments/useCommentActions";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types";
import { formatTimeAgo } from "@/utils";
import { CommentForm } from "./CommentForm";
import { CommentText } from "./CommentSingle";

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onCommentsChange?: () => void;
  taskId: string;
}

export function CommentList({
  comments,
  isLoading,
  scrollRef,
  onCommentsChange,
  taskId,
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
      <div ref={scrollRef} className="h-full overflow-y-auto relative">
        {comments.length === 0 ? (
          <ErrorBlock
            title="No comments yet"
            description="Comments will appear here"
            icon={<MessageCircle className="w-6 h-6 opacity-40" />}
            className="h-full border-none shadow-none absolute top-0 left-0 right-0 bottom-0"
          />
        ) : (
          <div className="space-y-2 pt-2 pb-4 px-4">
            <div className="w-full flex flex-col gap-2">
              {comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  taskId={taskId}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  taskId,
}: {
  comment: Comment;
  taskId: string;
}) {
  const timeAgo = formatTimeAgo(comment.createdAt);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { deleteComment, isUpdating } = useCommentActions(taskId);
  const currentUser = useCurrentUser();
  const canEdit = currentUser?.id === comment.author.id;

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteComment(comment.id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Comment updated");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-3 space-y-3 w-full bg-white/40",
        (isDeleting || isUpdating) && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-7 h-7 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
            <AvatarImage src={comment.author.profilePicture} />
            <AvatarFallback className="text-xs">
              {comment.author.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{comment.author.name}</p>
            <p className="text-xs text-muted-foreground" title={timeAgo}>
              {timeAgo}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {comment.resolved && (
            <Badge variant="secondary" className="text-xs">
              Resolved
            </Badge>
          )}
          {canEdit && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  disabled={isDeleting || isUpdating}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Comment actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={handleEdit}
                  disabled={isEditing || isDeleting || isUpdating}
                  className="gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || isUpdating}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {isEditing ? (
        <CommentForm
          taskId={taskId}
          editingComment={comment}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <CommentText comment={comment} />
      )}
    </div>
  );
}

function CommentListSkeleton() {
  return (
    <div className="p-3">
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
