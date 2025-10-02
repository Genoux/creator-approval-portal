"use client";

import { ModalDisclaimer } from "@/components/shared/ModalDisclaimer";

interface LayoutClientProps {
  children: React.ReactNode;
  showDisclaimer: boolean;
}

/**
 * Client wrapper for dashboard layout.
 * Handles the global disclaimer modal that appears once on first login.
 */
export function LayoutClient({ children, showDisclaimer }: LayoutClientProps) {
  return (
    <>
      {children}
      <ModalDisclaimer initialShow={showDisclaimer} />
    </>
  );
}
