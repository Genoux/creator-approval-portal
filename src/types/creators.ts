/**
 * Essential creator data extracted from ClickUp custom fields
 */
export interface CreatorData {
  // Profile
  profileImageUrl: string | null;
  
  // Social platforms
  instagramProfile: string | null;
  tiktokProfile: string | null;
  youtubeProfile: string | null;
  linkedinProfile: string | null;
  inBeatPortfolio: string | null;
  
  // Metrics
  followerCount: number | null;
  
  // Content
  example: string | null;
  whyGoodFit: string | null;
  
  // Approval status
  clientApproval: string | null;
  clientApprovalId: string | null;
}

/**
 * Social media platform types
 */
export type SocialPlatform = "TikTok" | "Instagram" | "YouTube" | "LinkedIn" | "External";

/**
 * Social profile information for UI display
 */
export interface SocialProfile {
  platform: SocialPlatform;
  handle: string | null;
  url: string | null;
  icon: string;
}

/**
 * Creator profile data optimized for UI components
 */
export interface CreatorProfile {
  // Basic info
  name: string;
  avatar: string | null;
  
  // Social presence
  primaryHandle: string | null;
  primaryProfileUrl: string | null;
  followerCount: string | null;
  socialProfiles: SocialProfile[];
  
  // Content examples
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

export type ApprovalLabel = (typeof APPROVAL_LABELS)[keyof typeof APPROVAL_LABELS];