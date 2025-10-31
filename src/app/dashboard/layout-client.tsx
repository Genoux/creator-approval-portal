"use client";

import { AnimatePresence, motion } from "motion/react";
import { InBeatIcon } from "@/components/icons/inBeat";
import { ModalDisclaimer } from "@/components/shared/ModalDisclaimer";
import { NoListsFound } from "@/components/shared/NoListsFound";
import { useCreatorManagement } from "@/hooks/useCreatorManagement";

interface LayoutClientProps {
  children: React.ReactNode;
  showDisclaimer: boolean;
}

function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <InBeatIcon className="w-16 h-16 text-foreground" animate />
    </div>
  );
}

/**
 * Client wrapper for dashboard layout.
 * Handles the global disclaimer modal and list selection overlay.
 */
export function LayoutClient({ children, showDisclaimer }: LayoutClientProps) {
  const { sharedLists, isLoading, error } = useCreatorManagement();
  if (error) throw error;

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && sharedLists.length === 0) {
    return <NoListsFound />;
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <ModalDisclaimer initialShow={showDisclaimer} />
    </>
  );
}
