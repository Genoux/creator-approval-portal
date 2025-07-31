import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types";
import type { Task } from "@/types/tasks";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async (): Promise<Task[]> => {
      const response = await fetch("/api/creators");
      const data: ApiResponse<Task[]> = await response.json();

      if (response.status === 401) {
        window.location.href = "/";
        return [];
      }

      if (!data.success) throw new Error(data.message);

      return data.data;
    },
    refetchInterval: 30000,
  });
}
