export function renderFieldValue(field: any): string {
  // Handle empty values - don't display if no value
  if (!field.value && field.value !== 0) return "";

  // Handle empty arrays
  if (Array.isArray(field.value) && field.value.length === 0) return "";

  switch (field.type) {
    case "drop_down": {
      // Handle dropdown: value is index, options are in type_config.options
      const options = field.type_config?.options || [];
      const selectedOption = options[field.value];
      return (
        selectedOption?.name || selectedOption?.label || field.value.toString()
      );
    }

    case "labels": {
      if (!Array.isArray(field.value)) return "";
      const labelOptions = field.type_config?.options || [];
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
