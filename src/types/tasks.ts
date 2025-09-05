export interface Task {
  id: string;
  name: string;
  status: {
    status: string;
    color?: string;
  };
  custom_fields?: Array<{
    id: string;
    name: string;
    type: string;
    value: string | number | boolean | null;
    type_config?: {
      options?: Array<{
        id: string;
        name?: string;
        label?: string;
        color?: string;
      }>;
    };
  }>;
}
