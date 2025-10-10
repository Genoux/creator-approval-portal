import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ClickUpComment } from "@/types";
import { useCommentActions } from "./useCommentActions";

// Mock dependencies
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/utils/errors", () => ({
  logError: vi.fn(),
}));

// Mock global fetch
global.fetch = vi.fn();

describe("useCommentActions", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("Create Comment", () => {
    it("should create comment successfully", async () => {
      const mockComment: ClickUpComment = {
        id: "comment-1",
        comment: [],
        comment_text: "Test comment",
        user: {
          id: 1,
          username: "testuser",
          email: "test@example.com",
          color: "#000000",
          profilePicture: "",
        },
        resolved: false,
        assignee: null,
        assigned_by: null,
        reactions: [],
        date: "2024-01-01T00:00:00Z",
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true, data: mockComment }),
      } as Response);

      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      const comment = await result.current.createComment({
        comment_text: "Test comment",
      });

      expect(comment).toEqual(mockComment);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/tasks/task-123/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ comment_text: "Test comment" }),
        }
      );
    });

    it("should throw error when taskId is empty", async () => {
      const { result } = renderHook(() => useCommentActions(""), {
        wrapper,
      });

      await expect(
        result.current.createComment({ comment_text: "Test" })
      ).rejects.toThrow("taskId is required");
    });

    it("should handle API error", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ message: "Internal error" }),
      } as Response);

      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      await expect(
        result.current.createComment({ comment_text: "Test" })
      ).rejects.toThrow("Internal error");
    });

    it("should handle invalid JSON response", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      await expect(
        result.current.createComment({ comment_text: "Test" })
      ).rejects.toThrow("Invalid server response");
    });
  });

  describe("Delete Comment", () => {
    it("should delete comment successfully", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      await result.current.deleteComment("comment-1");

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/tasks/task-123/comments/comment-1",
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );
    });

    it("should throw error when taskId is empty", async () => {
      const { result } = renderHook(() => useCommentActions(""), {
        wrapper,
      });

      await expect(result.current.deleteComment("comment-1")).rejects.toThrow(
        "taskId is required"
      );
    });

    it("should throw error when commentId is empty", async () => {
      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      await expect(result.current.deleteComment("")).rejects.toThrow(
        "commentId is required"
      );
    });

    it("should handle API error", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ message: "Comment not found" }),
      } as Response);

      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      await expect(result.current.deleteComment("comment-1")).rejects.toThrow(
        "Comment not found"
      );
    });
  });

  describe("Update Comment", () => {
    it("should update comment successfully", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      await result.current.updateComment({
        commentId: "comment-1",
        request: { comment_text: "Updated comment" },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/tasks/task-123/comments/comment-1",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ comment_text: "Updated comment" }),
        }
      );
    });

    it("should throw error when taskId is empty", async () => {
      const { result } = renderHook(() => useCommentActions(""), {
        wrapper,
      });

      await expect(
        result.current.updateComment({
          commentId: "comment-1",
          request: { comment_text: "Updated" },
        })
      ).rejects.toThrow("taskId is required");
    });

    it("should throw error when commentId is empty", async () => {
      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      await expect(
        result.current.updateComment({
          commentId: "",
          request: { comment_text: "Updated" },
        })
      ).rejects.toThrow("commentId is required");
    });

    it("should handle API error", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ message: "Forbidden" }),
      } as Response);

      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      await expect(
        result.current.updateComment({
          commentId: "comment-1",
          request: { comment_text: "Updated" },
        })
      ).rejects.toThrow("Forbidden");
    });
  });

  describe("Query Invalidation", () => {
    it("should invalidate comments query after create", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          success: true,
          data: { id: "1", comment_text: "Test" },
        }),
      } as Response);

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      await result.current.createComment({ comment_text: "Test" });

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: ["task-comments", "task-123"],
        });
      });
    });

    it("should invalidate comments query after delete", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      await result.current.deleteComment("comment-1");

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: ["task-comments", "task-123"],
        });
      });
    });

    it("should invalidate comments query after update", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCommentActions("task-123"), {
        wrapper,
      });

      await result.current.updateComment({
        commentId: "comment-1",
        request: { comment_text: "Updated" },
      });

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: ["task-comments", "task-123"],
        });
      });
    });
  });
});
