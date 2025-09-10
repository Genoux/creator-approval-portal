// Re-export types from centralized location
export type { ApprovalLabel } from "@/types";
export { APPROVAL_LABELS } from "@/types";
export {
  getApprovalFieldId,
  getApprovalOptionId,
  getApprovalStatus,
} from "./client-approval";
