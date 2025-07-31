import { CUSTOM_FIELD_IDS } from "@/constants/customFields";
import type { Task } from "@/types/tasks";

export function useTaskStatus(task: Task) {
  const getApprovalStatus = () => {
    const clientApprovalField = task.custom_fields?.find(
      (field) => field.id === CUSTOM_FIELD_IDS.CLIENT_APPROVAL
    );

    if (
      clientApprovalField?.value !== undefined &&
      clientApprovalField?.value !== null
    ) {
      if (clientApprovalField.type === "drop_down") {
        const options = clientApprovalField.type_config?.options || [];
        const value = clientApprovalField.value;
        const selectedOption =
          typeof value === "number"
            ? options[value]
            : options.find((opt) => opt.id === String(value));
        const status =
          selectedOption?.name || selectedOption?.label || "Unknown";

        // Map ClickUp statuses for button logic
        if (status === "Perfect (Approved)" || status === "Good (Approved)") {
          return "Accepted";
        } else if (status === "Poor Fit (Rejected)") {
          return "Declined";
        }
      }
    }
    return "Review";
  };

  return {
    currentStatus: getApprovalStatus(),
  };
}
