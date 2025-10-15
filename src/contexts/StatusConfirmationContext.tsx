"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { StatusConfirmationDialog } from "@/components/shared/StatusConfirmationDialog";
import { useCreatorManagement } from "@/hooks/useCreatorManagement";
import type { ApprovalLabel, Task } from "@/types";
import { ACTION_CONFIG } from "@/utils/status";

interface StatusConfirmationContextValue {
  handleStatusChange: (task: Task, newStatus: ApprovalLabel) => Promise<void>;
  isTaskPending: (taskId: string) => boolean;
}

const StatusConfirmationContext =
  createContext<StatusConfirmationContextValue | null>(null);

interface StatusConfirmationProviderProps {
  children: ReactNode;
}

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}

/**
 * Wraps task mutation handlers with confirmation dialogs
 */
export function StatusConfirmationProvider({
  children,
}: StatusConfirmationProviderProps) {
  const {
    handleApprove: _handleApprove,
    handleGood: _handleGood,
    handleBackup: _handleBackup,
    handleDecline: _handleDecline,
    isTaskPending,
  } = useCreatorManagement();

  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    title: "",
    description: "",
    confirmLabel: "",
    onConfirm: () => {},
  });

  const showConfirmation = (
    title: string,
    description: string,
    confirmLabel: string,
    onConfirm: () => void
  ) => {
    setConfirmation({
      isOpen: true,
      title,
      description,
      confirmLabel,
      onConfirm,
    });
  };

  const hideConfirmation = () => {
    setConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    confirmation.onConfirm();
    hideConfirmation();
  };

  const handleStatusChange = async (task: Task, newStatus: ApprovalLabel) => {
    // Check if we're removing from selections (to show different message)
    const isRemoving =
      (task.status.label === "Perfect (Approved)" ||
        task.status.label === "Good (Approved)") &&
      newStatus !== "Perfect (Approved)" &&
      newStatus !== "Good (Approved)";

    // Map status to handler function
    const statusHandlers: Record<
      Exclude<ApprovalLabel, "For Review">,
      (task: Task) => Promise<void>
    > = {
      "Perfect (Approved)": _handleApprove,
      "Good (Approved)": _handleGood,
      "Sufficient (Backup)": _handleBackup,
      "Poor Fit (Rejected)": _handleDecline,
    };

    const handler =
      statusHandlers[newStatus as Exclude<ApprovalLabel, "For Review">];
    const config =
      ACTION_CONFIG[newStatus as Exclude<ApprovalLabel, "For Review">];

    if (!handler || !config) return;

    // Execute with confirmation
    showConfirmation(
      config.modal.title,
      config.modal.description(task, isRemoving),
      config.modal.confirmLabel,
      () => handler(task)
    );
  };

  return (
    <StatusConfirmationContext.Provider
      value={{
        handleStatusChange,
        isTaskPending,
      }}
    >
      {children}
      <StatusConfirmationDialog
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        description={confirmation.description}
        confirmLabel={confirmation.confirmLabel}
        onConfirm={handleConfirm}
        onCancel={hideConfirmation}
      />
    </StatusConfirmationContext.Provider>
  );
}

export function useStatusConfirmation() {
  const context = useContext(StatusConfirmationContext);
  if (!context) {
    throw new Error(
      "useStatusConfirmation must be used within a StatusConfirmationProvider"
    );
  }
  return context;
}

/**
 * Hook to check if we're in a context where status confirmations are enabled.
 * Returns null if not in StatusConfirmationProvider (read-only mode).
 */
export function useGetStatusConfirmation() {
  return useContext(StatusConfirmationContext);
}
