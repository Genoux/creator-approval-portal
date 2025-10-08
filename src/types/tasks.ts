/**
 * Simple social profile
 */
export interface Social {
  platform: string;
  handle: string | null;
  url: string;
}

/**
 * Task - transformed from ClickUp with only the fields we need
 */
export interface Task {
  taskStatus: string;
  id: string;
  title: string;
  thumbnail: string | null;
  followerCount: string | null;
  date_created: string;
  status: {
    label: ApprovalLabel;
    fieldId: string;
  };
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

export type ApprovalLabel =
  | "For Review"
  | "Perfect (Approved)"
  | "Good (Approved)"
  | "Sufficient (Backup)"
  | "Poor Fit (Rejected)";
