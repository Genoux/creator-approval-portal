import type { BaseTask } from "@/types/tasks";

type CustomField = NonNullable<BaseTask["custom_fields"]>[0];

export function renderFieldValue(field: CustomField): string {
  // Handle empty values - don't display if no value
  if (!field.value && field.value !== 0) return "";

  // Handle empty arrays
  if (Array.isArray(field.value) && field.value.length === 0) return "";

  switch (field.type) {
    case "drop_down": {
      const typeConfig = field.type_config;
      const options =
        typeof typeConfig === "object" && typeConfig?.options
          ? typeConfig.options
          : [];
      const value = field.value;
      const selectedOption =
        typeof value === "number"
          ? options[value]
          : options.find((opt) => opt.id === String(value));
      return (
        selectedOption?.name || selectedOption?.label || field.value.toString()
      );
    }

    case "labels": {
      if (!Array.isArray(field.value)) return "";
      const typeConfig = field.type_config;
      const labelOptions =
        typeof typeConfig === "object" && typeConfig?.options
          ? typeConfig.options
          : [];
      const selectedLabels = field.value
        .map((valueId: string) => {
          const option = labelOptions.find(
            (opt: { id: string }) => opt.id === valueId
          );
          return option?.label || option?.name;
        })
        .filter(Boolean);

      return selectedLabels.join(", ");
    }

    case "checkbox":
      return field.value ? "✅ Yes" : "❌ No";

    case "email":
    case "text":
    case "short_text":
    case "number":
    default:
      return field.value.toString();
  }
}
