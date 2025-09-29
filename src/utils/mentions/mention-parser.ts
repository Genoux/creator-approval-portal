import type { User } from "@/types";

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
 * Parse mentions into comment format
 */
export function parseMentions(
  text: string,
  mentions: MentionData[],
  users: User[]
): ClickUpCommentRequest {
  // If no mentions, return simple text format
  if (!mentions || mentions.length === 0) {
    return { comment_text: text };
  }

  const userMap = new Map(users.map(user => [user.id.toString(), user]));
  const segments: ClickUpCommentSegment[] = [];

  let lastIndex = 0;

  // Sort mentions by position
  const sortedMentions = mentions.sort((a, b) => a.index - b.index);

  for (const mention of sortedMentions) {
    // Add text before mention
    if (mention.index > lastIndex) {
      const textBefore = text.slice(lastIndex, mention.index);
      if (textBefore) {
        segments.push({ text: textBefore });
      }
    }

    // Add mention tag
    const user = userMap.get(mention.id);
    if (user) {
      segments.push({
        type: "tag",
        user: { id: user.id },
      });
    }

    lastIndex = mention.index + mention.display.length + 1; // +1 for @ symbol
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      segments.push({ text: remainingText });
    }
  }

  // Return structured format for ClickUp API
  return { comment: segments };
}

/**
 * Validate mention data structure
 */
export function validateMentionData(mentions: MentionData[]): boolean {
  return mentions.every(mention =>
    mention.id &&
    mention.display &&
    typeof mention.index === 'number'
  );
}