"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { StatusConfirmationDialog } from "@/components/shared/StatusConfirmationDialog";
import { useCreatorManagement } from "@/contexts/CreatorManagementContext";
import type { ApprovalLabel, Task } from "@/types";

interface StatusConfirmationContextValue {
  handleApprove: (task: Task) => Promise<void>;
  handleGood: (task: Task) => Promise<void>;
  handleBackup: (task: Task) => Promise<void>;
  handleDecline: (task: Task) => Promise<void>;
  handleMoveToReview: (task: Task) => Promise<void>;
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
    handleMoveToReview: _handleMoveToReview,
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

  // Helper to determine if we're removing from selections
  const isRemovingFromSelections = (
    currentLabel: ApprovalLabel,
    newLabel: ApprovalLabel
  ) => {
    const isCurrentlySelected =
      currentLabel === "Perfect (Approved)" ||
      currentLabel === "Good (Approved)";
    const isNoLongerSelected =
      newLabel !== "Perfect (Approved)" && newLabel !== "Good (Approved)";
    return isCurrentlySelected && isNoLongerSelected;
  };

  // Wrapped handlers with confirmation
  const handleApprove = async (task: Task) => {
    showConfirmation(
      "You're about to select this creator.",
      `${task.title} will be added to your selections. Are you sure?`,
      "Yes, approve",
      () => _handleApprove(task)
    );
  };

  const handleGood = async (task: Task) => {
    showConfirmation(
      "You're about to select this creator.",
      `${task.title} will be added to your selections. Are you sure?`,
      "Yes, approve",
      () => _handleGood(task)
    );
  };

  const handleBackup = async (task: Task) => {
    if (isRemovingFromSelections(task.status.label, "Sufficient (Backup)")) {
      showConfirmation(
        "You're about to set this creator as backup.",
        `${task.title} will be removed from your selections. Are you sure?`,
        "Yes, set as backup",
        () => _handleBackup(task)
      );
    } else {
      showConfirmation(
        "You're about to set this creator as backup. Are you sure?",
        `${task.title} will be set as backup.`,
        "Yes, set as backup",
        () => _handleBackup(task)
      );
    }
  };

  const handleDecline = async (task: Task) => {
    if (isRemovingFromSelections(task.status.label, "Poor Fit (Rejected)")) {
      showConfirmation(
        "You're about to reject this creator.",
        `${task.title} will be removed from your selections. Are you sure?`,
        "Yes, reject",
        () => _handleDecline(task)
      );
    } else {
      showConfirmation(
        "You're about to reject this creator.",
        `${task.title} will be set as rejected. Are you sure?`,
        "Yes, reject",
        () => _handleDecline(task)
      );
    }
  };

  const handleMoveToReview = async (task: Task) => {
    _handleMoveToReview(task);
  };

  return (
    <StatusConfirmationContext.Provider
      value={{
        handleApprove,
        handleGood,
        handleBackup,
        handleDecline,
        handleMoveToReview,
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
