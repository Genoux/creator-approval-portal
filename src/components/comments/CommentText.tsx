import type { Comment } from "@/types";

interface CommentTextProps {
  comment: Comment;
  className?: string;
}

export function CommentText({ comment, className }: CommentTextProps) {
  if (comment.structuredComment && comment.structuredComment.length > 0) {
    return (
      <div className={className}>
        {comment.structuredComment.map(segment => {
          if (segment.type === "tag" && segment.user) {
            return (
              <span
                key={segment.user?.id}
                className="inline-block px-1.5 py-0.5 mx-0.5 text-xs font-medium text-[#007AFF] bg-blue-100 rounded-md"
              >
                @{segment.user.username || `User ${segment.user.id}`}
              </span>
            );
          }
          return (
            <span
              key={segment.user?.id}
              className="text-sm leading-relaxed whitespace-pre-wrap"
            >
              {segment.text || ""}
            </span>
          );
        })}
      </div>
    );
  }

  return <div className={className}>{comment.text}</div>;
}
