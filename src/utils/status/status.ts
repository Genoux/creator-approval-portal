import type { ApprovalLabel, StatusFilter } from "@/types";

interface StatusConfig {
  label: ApprovalLabel;
  displayLabel: string;
  taskStatus?: string;
}

export const STATUS_CONFIG: StatusConfig[] = [
  { label: "Perfect (Approved)", displayLabel: "Perfect", taskStatus: "selected" },
  { label: "Good (Approved)", displayLabel: "Good", taskStatus: "selected" },
  { label: "Sufficient (Backup)", displayLabel: "Backup", taskStatus: "backup" },
  { label: "Poor Fit (Rejected)", displayLabel: "Reject", taskStatus: "declined (client)" },
  { label: "For Review", displayLabel: "For Review" },
];

export function getDisplayLabel(filter: StatusFilter): string {
  if (filter === "All") return "All";
  return STATUS_CONFIG.find(c => c.label === filter)?.displayLabel || filter;
}

