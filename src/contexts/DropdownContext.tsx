"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface DropdownContextType {
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

interface DropdownProviderProps {
  children: ReactNode;
}

export function DropdownProvider({ children }: DropdownProviderProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  return (
    <DropdownContext.Provider value={{ openDropdownId, setOpenDropdownId }}>
      {children}
    </DropdownContext.Provider>
  );
}

export function useDropdown() {
  const context = useContext(DropdownContext);
  if (context === undefined) {
    throw new Error("useDropdown must be used within a DropdownProvider");
  }
  return context;
}
