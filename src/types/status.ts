import type { DropdownOption } from "./core";

// Response type for the status options API
export interface StatusOptionsResponse {
  field_id: string;
  field_name: string;
  options: DropdownOption[];
}
