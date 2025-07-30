import {
  CheckIcon,
  Loader2Icon,
  MoreHorizontalIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CUSTOM_FIELD_IDS } from "@/constants/customFields";
import type { Task } from "@/types/tasks";
import { renderFieldValue } from "@/utils/fieldRenderer";
import { showToast } from "@/utils/toast";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [loadingAction, setLoadingAction] = React.useState<
    "approve" | "decline" | "move_to_review" | null
  >(null);

  // Get current approval status
  const getApprovalStatus = () => {
    const clientApprovalField = task.custom_fields?.find(
      field => field.id === CUSTOM_FIELD_IDS.CLIENT_APPROVAL
    );

    if (
      clientApprovalField?.value !== undefined &&
      clientApprovalField?.value !== null
    ) {
      if (clientApprovalField.type === "drop_down") {
        const options = clientApprovalField.type_config?.options || [];
        const value = clientApprovalField.value;
        const selectedOption =
          typeof value === "number"
            ? options[value]
            : options.find(opt => opt.id === String(value));
        const status =
          selectedOption?.name || selectedOption?.label || "Unknown";

        // Map ClickUp statuses for button logic
        if (status === "Perfect (Approved)" || status === "Good (Approved)") {
          return "Accepted";
        } else if (status === "Poor Fit (Rejected)") {
          return "Declined";
        } else if (status === "Sufficient (Backup)") {
          return "Backup";
        }
      }
    }
    return "Review";
  };

  const currentStatus = getApprovalStatus();

  const handleApprove = async () => {
    if (loadingAction) return; // Prevent spam clicks

    setLoadingAction("approve");
    const loadingId = showToast.loading(`Approving ${task.name}...`);

    try {
      await sleep(1000);
      showToast.update(
        loadingId,
        "success",
        "Creator approved!",
        `${task.name} has been approved successfully`
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDecline = async () => {
    if (loadingAction) return; // Prevent spam clicks

    setLoadingAction("decline");
    const loadingId = showToast.loading(`Declining ${task.name}...`);

    try {
      await sleep(1000);
      showToast.update(
        loadingId,
        "error",
        "Creator declined",
        `${task.name} has been declined`
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleMoveToReview = async () => {
    if (loadingAction) return; // Prevent spam clicks

    setLoadingAction("move_to_review");
    const loadingId = showToast.loading(`Moving ${task.name} to review...`);

    try {
      await sleep(1000);
      showToast.update(
        loadingId,
        "success",
        "Moved to review",
        `${task.name} has been moved back to review`
      );
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-medium">
              {task.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight">
              {task.name}
            </CardTitle>
          </div>
          {(currentStatus === "Accepted" || currentStatus === "Declined" || currentStatus === "Backup") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  disabled={loadingAction !== null}
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleMoveToReview}
                  disabled={loadingAction !== null}
                  className="text-sm"
                >
                  {loadingAction === "move_to_review" ? (
                    <>
                      <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                      Moving...
                    </>
                  ) : (
                    "Move to review"
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      {task.custom_fields && task.custom_fields.length > 0 && (
        <CardContent>
          {task.custom_fields.map(field => {
            const value = renderFieldValue(field);
            if (!value) return null;

            // Hide Client Approval field since it's used for grouping
            if (field.id === CUSTOM_FIELD_IDS.CLIENT_APPROVAL) {
              return null;
            }

            // Special rendering for URL fields
            if (field.type === "url" && field.value) {
              const url = field.value.toString();

              return (
                <div
                  key={field.id}
                  className="text-xs text-muted-foreground mb-1"
                >
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    {field.name}
                  </Link>
                </div>
              );
            }

            return (
              <div
                key={field.id}
                className="text-xs text-muted-foreground mb-1"
              >
                <span className="font-medium">{field.name}:</span> {value}
              </div>
            );
          })}
        </CardContent>
      )}

      <CardFooter className="flex gap-2 pt-4">
        {currentStatus === "Declined" ? (
          // Only show Approve button for declined creators
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={loadingAction !== null}
            className="flex-1"
          >
            {loadingAction === "approve" ? (
              <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <CheckIcon className="w-4 h-4 mr-1" />
            )}
            Approve
          </Button>
        ) : currentStatus === "Accepted" ? (
          // Only show Decline button for approved creators
          <Button
            size="sm"
            variant="outline"
            onClick={handleDecline}
            disabled={loadingAction !== null}
            className="flex-1"
          >
            {loadingAction === "decline" ? (
              <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <XIcon className="w-4 h-4 mr-1" />
            )}
            Decline
          </Button>
        ) : currentStatus === "Backup" ? (
          // For backup creators, show both buttons
          <>
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={loadingAction !== null}
              className="flex-1"
            >
              {loadingAction === "approve" ? (
                <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <CheckIcon className="w-4 h-4 mr-1" />
              )}
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDecline}
              disabled={loadingAction !== null}
              className="flex-1"
            >
              {loadingAction === "decline" ? (
                <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <XIcon className="w-4 h-4 mr-1" />
              )}
              Decline
            </Button>
          </>
        ) : (
          // Show both buttons for creators to review
          <>
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={loadingAction !== null}
              className="flex-1"
            >
              {loadingAction === "approve" ? (
                <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <CheckIcon className="w-4 h-4 mr-1" />
              )}
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDecline}
              disabled={loadingAction !== null}
              className="flex-1"
            >
              {loadingAction === "decline" ? (
                <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <XIcon className="w-4 h-4 mr-1" />
              )}
              Decline
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
