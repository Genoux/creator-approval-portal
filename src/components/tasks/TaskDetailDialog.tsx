import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { Task } from "@/types/tasks";

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
              <p className="text-sm text-muted-foreground">
                Creator Management
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4">
          {task.custom_fields && task.custom_fields.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-blue-600 border-b pb-1 mb-3">
                📊 Creator Information
              </div>
              {task.custom_fields.map((field) => {
                if (!field.value) return null;

                return (
                  <div key={field.id} className="border-b pb-2">
                    <div className="font-medium text-sm text-muted-foreground mb-1">
                      {field.name}
                    </div>
                    <div className="text-sm">{String(field.value)}</div>
                  </div>
                );
              })}
            </div>
          )}

          {task.status && (
            <div className="mt-3 pt-3 border-t">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </div>
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: task.status.color || "#e5e7eb",
                  color: "#374151",
                }}
              >
                {task.status.status}
              </span>
            </div>
          )}

          {task.description && (
            <div className="mt-3 pt-3 border-t">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Description
              </div>
              <div className="text-sm text-gray-700">{task.description}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
