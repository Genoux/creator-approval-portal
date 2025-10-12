"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { StatusConfirmationDialog } from "@/components/shared/StatusConfirmationDialog";
import { useCreatorManagement } from "@/contexts/CreatorManagementContext";
import type { ApprovalLabel, Task } from "@/types";

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
 * Wraps task mutation handlers with confirmation dialogs.
 * Gets raw handlers from CreatorManagementProvider.
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

  const isRemovingFromSelections = (
    current: ApprovalLabel,
    next: ApprovalLabel
  ) =>
    (current === "Perfect (Approved)" || current === "Good (Approved)") &&
    next !== "Perfect (Approved)" &&
    next !== "Good (Approved)";

  const handleStatusChange = async (task: Task, newStatus: ApprovalLabel) => {
    const isRemoving = isRemovingFromSelections(task.status.label, newStatus);

    // Configuration for each actionable status
    const statusConfig: Record<
      Exclude<ApprovalLabel, "For Review">,
      {
        handler: (task: Task) => Promise<void>;
        modal: {
          title: string;
          description: string;
          confirmLabel: string;
        };
      }
    > = {
      "Perfect (Approved)": {
        handler: _handleApprove,
        modal: {
          title: "You're about to select this creator.",
          description: `${task.title} will be added to your selections. Are you sure?`,
          confirmLabel: "Yes, approve",
        },
      },
      "Good (Approved)": {
        handler: _handleGood,
        modal: {
          title: "You're about to select this creator.",
          description: `${task.title} will be added to your selections. Are you sure?`,
          confirmLabel: "Yes, approve",
        },
      },
      "Sufficient (Backup)": {
        handler: _handleBackup,
        modal: {
          title: "You're about to set this creator as backup.",
          description: isRemoving
            ? `${task.title} will be removed from your selections. Are you sure?`
            : `${task.title} will be set as backup.`,
          confirmLabel: "Yes, set as backup",
        },
      },
      "Poor Fit (Rejected)": {
        handler: _handleDecline,
        modal: {
          title: "You're about to reject this creator.",
          description: isRemoving
            ? `${task.title} will be removed from your selections. Are you sure?`
            : `${task.title} will be set as rejected. Are you sure?`,
          confirmLabel: "Yes, reject",
        },
      },
    };

    const config =
      statusConfig[newStatus as Exclude<ApprovalLabel, "For Review">];
    if (!config) return;

    // Execute with confirmation
    showConfirmation(
      config.modal.title,
      config.modal.description,
      config.modal.confirmLabel,
      () => config.handler(task)
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
