"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface DropdownContextType {
  openDropdownId: string | null;
  registerDropdown: (id: string) => void;
  closeDropdown: () => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

interface DropdownProviderProps {
  children: ReactNode;
}

export function DropdownProvider({ children }: DropdownProviderProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const registerDropdown = (id: string) => {
    setOpenDropdownId(id);
  };

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  return (
    <DropdownContext.Provider
      value={{ openDropdownId, registerDropdown, closeDropdown }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

export function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (context === undefined) {
    throw new Error(
      "useDropdownContext must be used within a DropdownProvider"
    );
  }
  return context;
}
