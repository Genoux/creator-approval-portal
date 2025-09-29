"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCommentActions } from "@/hooks/data/comments/useCommentActions";
import { useWorkspaceUsers } from "@/hooks/data/users/useWorkspaceUsers";
import {
  type MentionData,
  parseMentions,
} from "@/utils/mentions/mention-parser";
import { CommentInput } from "./CommentInput";

interface CommentFormProps {
  taskId: string;
  onCommentSent?: () => void;
}

export function CommentForm({ taskId, onCommentSent }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [mentions, setMentions] = useState<MentionData[]>([]);
  const { createComment, isCreating, createError } = useCommentActions(taskId);
  const { data: users = [] } = useWorkspaceUsers();

  const handleMentionChange = (value: string, mentionData: MentionData[]) => {
    setComment(value);
    setMentions(mentionData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      const parsedComment = parseMentions(comment, mentions, users);
      await createComment(parsedComment);
      setComment("");
      setMentions([]);
      onCommentSent?.();
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 px-4 mt-2 min-w-full max-w-sm"
    >
      <CommentInput
        value={comment}
        onChange={handleMentionChange}
        users={users}
        placeholder="Add a comment... (Use @ to mention users)"
        disabled={isCreating}
      >
        <Button
          type="submit"
          size="sm"
          disabled={!comment.trim() || isCreating}
          className="rounded-full bg-[#2A0006] text-white hover:bg-[#2A0006]/90 cursor-pointer"
        >
          {isCreating ? "Sending..." : "Send"}
        </Button>
      </CommentInput>

      {createError && <p className="text-sm text-destructive">{createError}</p>}
    </form>
  );
}
