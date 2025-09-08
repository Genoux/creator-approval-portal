"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCommentActions } from "@/hooks/comments/useCommentActions";

interface CommentFormProps {
  taskId: string;
}

export function CommentForm({ taskId }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const { createComment, isCreating, createError } = useCommentActions(taskId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      await createComment({ comment_text: comment.trim() });
      setComment("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a comment..."
        className="min-h-[90px] resize-none bg-white rounded-2xl"
        disabled={isCreating}
      />

      {createError && <p className="text-sm text-destructive">{createError}</p>}

      <div className="flex justify-end items-center">
        <Button
          type="submit"
          size="sm"
          disabled={!comment.trim() || isCreating}
          className="gap-2 h-10 p-4 rounded-full bg-[#2A0006] text-white hover:bg-[#2A0006]/90"
        >
          {isCreating ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
}
