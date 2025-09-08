"use client";

import { useEffect, useState } from "react";

interface BoardInfo {
  boardName?: string;
  boardId?: string;
  folderName?: string;
  spaceName?: string;
  workspaceId?: string;
  clickupUrl?: string;
  isLoading?: boolean;
}

export function useBoardInfo() {
  const [boardInfo, setBoardInfo] = useState<BoardInfo>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBoardInfo = async () => {
      try {
        const response = await fetch("/api/board-info");
        if (response.ok) {
          const data = await response.json();
          setBoardInfo({
            boardName: data.boardName,
            boardId: data.boardId,
            folderName: data.folderName,
            spaceName: data.spaceName,
            workspaceId: data.workspaceId,
            clickupUrl: data.clickupUrl,
          });
        } else {
          console.error(
            "API response not ok:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching board info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoardInfo();
  }, []);

  return {
    ...boardInfo,
    isLoading,
  };
}
