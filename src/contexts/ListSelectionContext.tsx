"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

const SELECTED_LIST_KEY = "creator-management-list-id";

interface ListSelectionContextValue {
  selectedListId: string | null;
  setSelectedListId: (listId: string | null) => void;
}

const ListSelectionContext = createContext<ListSelectionContextValue | null>(
  null
);

interface ListSelectionProviderProps {
  children: ReactNode;
}

/**
 * Manages list selection state and localStorage persistence
 * Single responsibility: List selection only
 */
export function ListSelectionProvider({
  children,
}: ListSelectionProviderProps) {
  const [selectedListId, setSelectedListIdState] = useState<string | null>(
    () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem(SELECTED_LIST_KEY);
      }
      return null;
    }
  );

  const setSelectedListId = useCallback((listId: string | null) => {
    if (listId) {
      localStorage.setItem(SELECTED_LIST_KEY, listId);
    } else {
      localStorage.removeItem(SELECTED_LIST_KEY);
    }
    setSelectedListIdState(listId);
  }, []);

  return (
    <ListSelectionContext.Provider
      value={{
        selectedListId,
        setSelectedListId,
      }}
    >
      {children}
    </ListSelectionContext.Provider>
  );
}

export function useListSelection() {
  const context = useContext(ListSelectionContext);
  if (!context) {
    throw new Error(
      "useListSelection must be used within a ListSelectionProvider"
    );
  }
  return context;
}
