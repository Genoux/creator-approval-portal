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
                className="inline-block px-0.5 text-[13px] font-medium text-[#2A0006] bg-[#2A0006]/10 rounded-sm"
              >
                @{segment.user.username}
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
