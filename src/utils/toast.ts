import { toast } from "sonner";

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },

  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },

  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  update: (
    id: string | number,
    type: "success" | "error",
    message: string,
    description?: string
  ) => {
    if (type === "success") {
      toast.success(message, { id, description });
    } else {
      toast.error(message, { id, description });
    }
  },
};
