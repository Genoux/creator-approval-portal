import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CUSTOM_FIELD_IDS } from "@/constants/customFields";
import { useTaskActions } from "@/hooks/tasks/useTaskActions";
import { useTaskStatus } from "@/hooks/tasks/useTaskStatus";
import type { Task } from "@/types/tasks";
import { renderFieldValue } from "@/utils/fieldRenderer";

interface TaskDetailDialogProps {
  task: Task;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  children,
}: TaskDetailDialogProps) {
  const { handleApprove, handleDecline, isPending } = useTaskActions();
  const { currentStatus } = useTaskStatus(task);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-15 h-15">
              <AvatarImage src="" />
              <AvatarFallback className="bg-accent-foreground text-white">
                {task.name
                  .replace(/^\[TEST\]\s*/, "")
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {task.name.replace(/^\[TEST\]\s*/, "")}
              </h2>
              <p className="text-sm text-muted-foreground">Creator Details</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4">
          {task.custom_fields && task.custom_fields.length > 0 && (
            <div className="space-y-3">
              {task.custom_fields.map(field => {
                const value = renderFieldValue(field);
                if (!value) return null;

                if (field.id === CUSTOM_FIELD_IDS.CLIENT_APPROVAL) {
                  return null;
                }

                if (field.type === "url" && field.value) {
                  const url = field.value.toString();

                  return (
                    <div key={field.id} className="border-b pb-2">
                      <div className="font-medium text-sm text-muted-foreground mb-1">
                        {field.name}
                      </div>
                      <Link
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {url}
                      </Link>
                    </div>
                  );
                }

                return (
                  <div key={field.id} className="border-b pb-2">
                    <div className="font-medium text-sm text-muted-foreground mb-1">
                      {field.name}
                    </div>
                    <div className="text-sm">{value}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full">
            {currentStatus === "Declined" ? (
              <DialogClose asChild>
                <Button
                  onClick={() => handleApprove(task)}
                  disabled={isPending}
                  className="flex-1"
                >
                  {isPending ? (
                    <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <CheckIcon className="w-4 h-4 mr-1" />
                  )}
                  Approve
                </Button>
              </DialogClose>
            ) : currentStatus === "Accepted" ? (
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => handleDecline(task)}
                  disabled={isPending}
                  className="flex-1"
                >
                  {isPending ? (
                    <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <XIcon className="w-4 h-4 mr-1" />
                  )}
                  Decline
                </Button>
              </DialogClose>
            ) : currentStatus === "Review" ? (
              <>
                <DialogClose asChild>
                  <Button
                    onClick={() => handleApprove(task)}
                    disabled={isPending}
                    className="flex-1"
                  >
                    {isPending ? (
                      <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <CheckIcon className="w-4 h-4 mr-1" />
                    )}
                    Approve
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => handleDecline(task)}
                    disabled={isPending}
                    className="flex-1"
                  >
                    {isPending ? (
                      <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <XIcon className="w-4 h-4 mr-1" />
                    )}
                    Decline
                  </Button>
                </DialogClose>
              </>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
