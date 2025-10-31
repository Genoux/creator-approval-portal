import { toast } from "sonner";

const toastStyle = {
  style: {
    background: "#000000",
    border: "1px solid #333333",
    color: "#ffffff",
  },
};

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description, ...toastStyle });
  },

  error: (message: string, description?: string) => {
    toast.error(message, { description, ...toastStyle });
  },

  info: (message: string, description?: string) => {
    toast.info(message, { description, ...toastStyle });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, { description, ...toastStyle });
  },

  loading: (message: string) => {
    return toast.loading(message, toastStyle);
  },

  update: (
    id: string | number,
    type: "success" | "error",
    message: string,
    description?: string
  ) => {
    toast[type](message, { id, description, ...toastStyle });
  },
};
