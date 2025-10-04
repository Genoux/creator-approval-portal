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
  attributes?: {
    link?: string;
  };
}

export interface ClickUpCommentRequest {
  comment_text?: string;
  comment?: ClickUpCommentSegment[];
}

/**
 * Parse text segment for URLs and split into text/link segments
 */
function parseLinks(text: string): ClickUpCommentSegment[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const segments: ClickUpCommentSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  urlRegex.lastIndex = 0;
  match = urlRegex.exec(text);

  while (match !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) });
    }

    // Add the URL as a link segment
    segments.push({
      text: match[0],
      attributes: { link: match[0] }
    });

    lastIndex = match.index + match[0].length;
    match = urlRegex.exec(text);
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ text }];
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
    // No mentions, but check for links
    const linkSegments = parseLinks(text);
    if (linkSegments.length > 1 || linkSegments[0].attributes?.link) {
      return { comment: linkSegments };
    }
    return { comment_text: text };
  }

  const userMap = new Map(users.map(user => [user.id.toString(), user]));
  const segments: ClickUpCommentSegment[] = [];
  let lastIndex = 0;

  for (const mention of textMentions) {
    if (mention.start > lastIndex) {
      const textBefore = text.slice(lastIndex, mention.start);
      if (textBefore) {
        // Parse links in text before mention
        segments.push(...parseLinks(textBefore));
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
      // Parse links in remaining text
      segments.push(...parseLinks(remainingText));
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
    } else if (segment.attributes?.link) {
      // This is a link - just use the URL text
      text += segment.text || segment.attributes.link;
    } else if (segment.text) {
      // This is regular text
      text += segment.text;
    }
  }

  return text;
}
