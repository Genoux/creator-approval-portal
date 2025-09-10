import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { QUERY_KEYS } from "@/lib/query-keys";

interface SelectBoardParams {
  boardId: string;
  boardName: string;
  listId: string;
  listName: string;
}

interface UseListSelectResult {
  selectBoard: (
    boardId: string,
    boardName: string,
    listId: string,
    listName: string
  ) => Promise<void>;
  isSelecting: boolean;
  error: string | null;
}

export function useListSelect(): UseListSelectResult {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      boardId,
      boardName,
      listId,
      listName,
    }: SelectBoardParams) => {
      const response = await fetch("/api/clickup/select-board", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId,
          boardName,
          listId,
          listName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to select board");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate tasks since we have a new board selected
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
      // Redirect to dashboard
      router.push("/dashboard");
    },
  });

  const selectBoard = async (
    boardId: string,
    boardName: string,
    listId: string,
    listName: string
  ) => {
    await mutation.mutateAsync({ boardId, boardName, listId, listName });
  };

  return {
    selectBoard,
    isSelecting: mutation.isPending,
    error: mutation.error?.message || null,
  };
}
