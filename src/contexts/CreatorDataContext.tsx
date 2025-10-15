"use client";

import { createContext, type ReactNode, useContext, useEffect } from "react";
import { useCreatorData } from "@/hooks/data/useCreatorData";
import { useListSelection } from "./ListSelectionContext";

/**
 * Provides creator data to all dashboard pages
 * Uses ListSelectionContext for list state
 * Uses useCreatorData hook for data fetching
 */
const CreatorDataContext = createContext(
  null as ReturnType<typeof useCreatorData> | null
);

interface CreatorDataProviderProps {
  children: ReactNode;
}

export function CreatorDataProvider({ children }: CreatorDataProviderProps) {
  const { selectedListId, setSelectedListId } = useListSelection();
  const data = useCreatorData(selectedListId);

  // Auto-select first list when lists load
  useEffect(() => {
    if (data.sharedLists.length === 0) return;

    // If we have a selected list and it's valid, keep it
    if (
      selectedListId &&
      data.sharedLists.some(l => l.listId === selectedListId)
    ) {
      return;
    }

    // Otherwise, select the first list
    const firstListId = data.sharedLists[0].listId;
    setSelectedListId(firstListId);
  }, [data.sharedLists, selectedListId, setSelectedListId]);

  return (
    <CreatorDataContext.Provider value={data}>
      {children}
    </CreatorDataContext.Provider>
  );
}

export function useCreatorDataContext() {
  const context = useContext(CreatorDataContext);
  if (!context) {
    throw new Error(
      "useCreatorDataContext must be used within a CreatorDataProvider"
    );
  }
  return context;
}
