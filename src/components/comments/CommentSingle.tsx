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
          // Handle user mentions
          if (segment.type === "tag" && segment.user) {
            return (
              <span
                key={Math.random()}
                className="inline-block px-0.5 text-[13px] font-medium text-[#2A0006] bg-[#2A0006]/10 rounded-sm"
              >
                @{segment.user.username}
              </span>
            );
          }

          // Handle links (check for link attribute)
          if (segment.attributes?.link && segment.text && segment.text.trim()) {
            return (
              <a
                key={Math.random()}
                href={segment.attributes.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline leading-relaxed"
              >
                {segment.text}
              </a>
            );
          }

          // Handle regular text
          if (segment.text) {
            return (
              <span
                key={Math.random()}
                className="text-sm leading-relaxed whitespace-pre-wrap"
              >
                {segment.text}
              </span>
            );
          }

          return null;
        })}
      </div>
    );
  }

  return <div className={className}>{comment.text}</div>;
}
