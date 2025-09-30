import type { Comment, User } from "@/types";

export interface MentionData {
  id: string;
  display: string;
  index: number;
}

export interface ClickUpCommentSegment {
  type?: "tag";
  text?: string;
  user?: { id: number };
}

export interface ClickUpCommentRequest {
  comment_text?: string;
  comment?: ClickUpCommentSegment[];
}

/**
 * Serialize mentions from user input to ClickUp API format
 */
export function serializeMentions(
  text: string,
  _mentions: MentionData[],
  users: User[]
): ClickUpCommentRequest {
  const mentionRegex = /@\[([^\]]+)\]\((\d+)\)/g;
  const textMentions: Array<{ display: string; id: string; start: number; end: number }> = [];
  let match: RegExpExecArray | null = null;

  mentionRegex.lastIndex = 0;

  match = mentionRegex.exec(text);
  while (match !== null) {
    textMentions.push({
      display: match[1],
      id: match[2],
      start: match.index,
      end: match.index + match[0].length
    });
    match = mentionRegex.exec(text);
  }

  if (textMentions.length === 0) {
    return { comment_text: text };
  }

  const userMap = new Map(users.map(user => [user.id.toString(), user]));
  const segments: ClickUpCommentSegment[] = [];
  let lastIndex = 0;

  for (const mention of textMentions) {
    if (mention.start > lastIndex) {
      const textBefore = text.slice(lastIndex, mention.start);
      if (textBefore) {
        segments.push({ text: textBefore });
      }
    }

    const user = userMap.get(mention.id);
    if (user) {
      segments.push({
        type: "tag",
        user: { id: user.id },
      });
    } else {
      segments.push({ text: text.slice(mention.start, mention.end) });
    }

    lastIndex = mention.end;
  }

  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      segments.push({ text: remainingText });
    }
  }

  return { comment: segments };
}

/**
 * Deserialize mentions from ClickUp API format to user-editable text
 */
export function deserializeMentions(comment: Comment): string {
  // If no structured comment, just return the plain text
  if (!comment.structuredComment || comment.structuredComment.length === 0) {
    return comment.text;
  }

  let text = "";

  for (const segment of comment.structuredComment) {
    if (segment.type === "tag" && segment.user) {
      // This is a mention - convert to react-mentions format
      const displayName = segment.user.username || `User ${segment.user.id}`;
      text += `@[${displayName}](${segment.user.id})`;
    } else if (segment.text) {
      // This is regular text
      text += segment.text;
    }
  }

  return text;
}
