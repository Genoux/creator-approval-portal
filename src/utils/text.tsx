import React from "react";

interface DeltaOp {
  insert: string;
  attributes?: {
    link?: string;
    "block-id"?: string;
  };
}

interface DeltaFormat {
  ops: DeltaOp[];
}

/**
 * Parse ClickUp Delta format rich text and render with links
 */
export function RichText({
  deltaText,
  className,
}: {
  deltaText: string;
  className?: string;
}) {
  try {
    const delta: DeltaFormat = JSON.parse(deltaText);

    return (
      <span className={className}>
        {delta.ops.map(op => {
          const text = op.insert.replace(/\\n/g, "\n");

          if (op.attributes?.link) {
            return (
              <a
                key={`link-${op.attributes.link}`}
                href={op.attributes.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2A0006] hover:text-[#2A0006]/90 underline"
              >
                {text}
              </a>
            );
          }

          return <React.Fragment key={`text-${text}`}>{text}</React.Fragment>;
        })}
      </span>
    );
  } catch {
    // Fallback to plain text if parsing fails
    return <span className={className}>{deltaText}</span>;
  }
}
