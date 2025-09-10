// Creator-related types and interfaces

/**
 * Essential creator data extracted from ClickUp custom fields
 * This represents the clean, UI-ready data after field discovery and processing
 */
export interface CreatorData {
  // Profile
  profileImageUrl: string | null;
  
  // Social platforms
  instagramProfile: string | null;
  tiktokProfile: string | null;
  youtubeProfile: string | null;
  
  // Metrics
  followerCount: number | null;
  
  // Content
  example: string | null;
  whyGoodFit: string | null;
  creatorType: string | null;
  
  // Approval status
  clientApproval: string | null;
  clientApprovalId: string | null;
}

/**
 * Social media platform types
 */
export type SocialPlatform = "TikTok" | "Instagram" | "YouTube";

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
  followerCount: string | null;
  socialProfiles: SocialProfile[];
  
  // Creator details
  type: string | null;
  
  // Content examples
  portfolio: {
    example: string | null;
    whyGoodFit: string | null;
  };
  
  // UI helpers
  hasSocialProfiles: boolean;
  hasPortfolio: boolean;
  displayName: string;
  mainPlatform: SocialPlatform | null;
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