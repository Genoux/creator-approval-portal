import Image from "next/image";

export interface MentionUser {
  id: string | number;
  display?: string;
  username?: string;
  profilePicture?: string;
}

interface MentionSuggestionProps {
  suggestion: MentionUser;
}

export function MentionSuggestion({ suggestion }: MentionSuggestionProps) {
  return (
    <div className="flex items-center gap-2">
      {suggestion.profilePicture ? (
        <Image
          src={suggestion.profilePicture}
          alt={suggestion.display || "User"}
          width={16}
          height={16}
          className="rounded-full"
        />
      ) : (
        <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
          {suggestion.display?.charAt(0).toUpperCase() || "?"}
        </div>
      )}
      <span>{suggestion.display || "Unknown"}</span>
    </div>
  );
}
