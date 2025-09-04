// Clean types only - no business logic

// Type for status updates (option ID or null to clear)
export type StatusUpdate = string | null;

// Helper type for the option structure from ClickUp API
export interface ClickUpDropdownOption {
  id: string;
  name?: string;
  label?: string;
}

// Response type for the status options API
export interface StatusOptionsResponse {
  field_id: string;
  field_name: string;
  options: ClickUpDropdownOption[];
}
