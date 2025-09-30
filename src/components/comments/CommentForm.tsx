"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCommentActions } from "@/hooks/data/comments/useCommentActions";
import { useWorkspaceUsers } from "@/hooks/data/users/useWorkspaceUsers";
import type { Comment } from "@/types";
import {
  deserializeMentions,
  type MentionData,
  serializeMentions,
} from "@/utils";
import { CommentInput } from "./CommentInput";

interface CommentFormProps {
  taskId: string;
  onCommentSent?: () => void;
  // Edit mode props
  editingComment?: Comment;
  onSave?: () => void;
  onCancel?: () => void;
}

export function CommentForm({
  taskId,
  onCommentSent,
  editingComment,
  onSave,
  onCancel,
}: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [mentions, setMentions] = useState<MentionData[]>([]);
  const { createComment, updateComment, isCreating, isUpdating, createError } =
    useCommentActions(taskId);
  const { data: users = [] } = useWorkspaceUsers();

  const isEditMode = !!editingComment;
  const isLoading = isCreating || isUpdating;

  // Initialize with editing comment if in edit mode
  useEffect(() => {
    if (editingComment) {
      const text = deserializeMentions(editingComment);
      setComment(text);
      setMentions([]); // Let react-mentions parse mentions from the text
    }
  }, [editingComment]);

  const handleMentionChange = (value: string, mentionData: MentionData[]) => {
    setComment(value);
    setMentions(mentionData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      const serializedMentions = serializeMentions(comment, mentions, users);

      if (isEditMode && editingComment) {
        const updateRequest = serializedMentions;

        await updateComment({
          commentId: editingComment.id,
          request: updateRequest,
        });
        onSave?.();
      } else {
        await createComment(serializedMentions);
        setComment("");
        setMentions([]);
        onCommentSent?.();
      }
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} comment:`,
        error
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CommentInput
        value={comment}
        onChange={handleMentionChange}
        users={users}
        placeholder={
          isEditMode
            ? "Edit your comment..."
            : "Add a comment... (Use @ to mention users)"
        }
        disabled={isLoading}
      >
        {isEditMode ? (
          <div className="flex gap-1 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
              className="rounded-full cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!comment.trim() || isLoading}
              className="rounded-full bg-[#2A0006] text-white hover:bg-[#2A0006]/90 cursor-pointer"
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            size="sm"
            disabled={!comment.trim() || isLoading}
            className="rounded-full bg-[#2A0006] text-white hover:bg-[#2A0006]/90 cursor-pointer"
          >
            {isCreating ? "Sending..." : "Send"}
          </Button>
        )}
      </CommentInput>

      {createError && <p className="text-sm text-destructive">{createError}</p>}
    </form>
  );
}
