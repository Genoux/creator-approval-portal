/**
 * Simple social profile
 */
export interface Social {
  platform: string;
  handle: string | null;
  url: string;
}

/**
 * Creator profile - clean and simple
 */
export interface Creator {
  title: string;
  thumbnail: string | null;
  followerCount: string | null;
  er: {
    text: string | null;
    formula: string | null;
  };
  socials: Social[];
  portfolio: {
    example: string | null;
    whyGoodFit: string | null;
    inBeatPortfolio: string | null;
  };
}

/**
 * Approval status labels
 */
export const APPROVAL_LABELS = {
  FOR_REVIEW: "For Review",
  PERFECT: "Perfect (Approved)",
  GOOD: "Good (Approved)",
  SUFFICIENT: "Sufficient (Backup)",
  POOR_FIT: "Poor Fit (Rejected)",
} as const;

export type ApprovalLabel =
  | "For Review"
  | "Perfect (Approved)"
  | "Good (Approved)"
  | "Sufficient (Backup)"
  | "Poor Fit (Rejected)";
