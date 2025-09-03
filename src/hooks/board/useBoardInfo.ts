"use client";

import { useEffect, useState } from "react";

export function useBoardInfo() {
  const [boardName, setBoardName] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBoardInfo = async () => {
      try {
        const response = await fetch("/api/board-info");
        if (response.ok) {
          const data = await response.json();
          setBoardName(data.boardName);
        }
      } catch (error) {
        console.error("Error fetching board info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoardInfo();
  }, []);

  return { boardName, isLoading };
}
