"use client";

import type React from "react";
import { Mention, MentionsInput } from "react-mentions";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User } from "@/types";
import type { MentionData } from "@/utils/mentions/mention-parser";
import type { MentionUser } from "../mentions/MentionSuggestion";
import { MentionSuggestion } from "../mentions/MentionSuggestion";

interface CommentInputProps {
  value: string;
  onChange: (value: string, mentions: MentionData[]) => void;
  users: User[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function CommentInput({
  value,
  onChange,
  users,
  placeholder = "Add a comment... (Use @ to mention users)",
  disabled = false,
  className = "min-h-[90px] bg-white rounded-2xl border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  children,
}: CommentInputProps) {
  // Transform users for react-mentions format
  const mentionUsers: MentionUser[] = users.map(user => ({
    id: user.id.toString(),
    display: user.username || user.email || `User ${user.id}`,
    username: user.username,
    profilePicture: user.profilePicture,
  }));

  const handleChange = (
    _: { target: { value: string } },
    newValue: string,
    __: string,
    mentions: MentionData[]
  ) => {
    onChange(newValue, mentions);
  };

  return (
    <div className={`${className} relative`}>
      <MentionsInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          control: {
            fontSize: 14,
            fontWeight: "normal",
          },
          highlighter: {
            border: "none",
            borderRadius: "16px",
            fontWeight: "normal",
            overflow: "auto",
            minHeight: "90px",
            maxHeight: "200px",
          },
          input: {
            padding: "12px",
            border: "none",
            borderRadius: "16px",
            minHeight: "90px",
            maxHeight: "200px",
            outline: "none",
            fontFamily: "inherit",
            fontSize: "14px",
            resize: "none",
            overflow: "auto",
          },
          suggestions: {
            overflow: "hidden",
            borderRadius: "6px",
            marginTop: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            list: {
              backgroundColor: "white",
              fontSize: 14,
              maxHeight: 200,
              overflow: "auto",
              zIndex: 50,
            },
            item: {
              padding: "8px 12px",
              borderBottom: "1px solid #f3f4f6",
              "&focused": {
                backgroundColor: "#f9fafb",
              },
            },
          },
        }}
      >
        <Mention
          trigger="@"
          data={mentionUsers}
          markup="@[__display__](__id__)"
          appendSpaceOnAdd
          displayTransform={(_, display) => display}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            fontSize: 14,
            maxHeight: 200,
            overflow: "hidden",
            zIndex: 50,
            borderRadius: "5px",
            marginTop: "24px",
            border: "1px solid #e5e7eb",
          }}
          renderSuggestion={(suggestion: MentionUser) => (
            <MentionSuggestion suggestion={suggestion} />
          )}
        />
      </MentionsInput>
      {children && (
        <div className="p-2 ml-auto flex justify-end w-full">{children}</div>
      )}
    </div>
  );
}
