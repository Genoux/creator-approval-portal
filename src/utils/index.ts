// Clean, organized utilities with consistent naming

// Approval system
export * from "./approval";
// Creator data
export * from "./creators";
// Field helpers
export * from "./fields";

// Social media
export * from "./social";

// UI utilities
export * from "./ui";

// Legacy aliases for backward compatibility (temporary)
import { CLIENT_APPROVAL } from "./approval";

export {
  type ClientApprovalLabel as ApprovalLabel,
  getClientApprovalOptionId as getApprovalOptionId,
  getClientApprovalStatus as getApprovalStatus,
} from "./approval";

// Export the LABELS directly, not the whole CLIENT_APPROVAL object
export const APPROVAL_LABELS = CLIENT_APPROVAL.LABELS;
export const APPROVAL_FIELD_ID = CLIENT_APPROVAL.FIELD_ID;
