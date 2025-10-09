import { XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/ui/useIsMobile";
import type { Task } from "@/types";
import { TaskComments } from "./TaskComments";
import { TaskDetails } from "./TaskDetails";

interface TaskModalProps {
  task: Task;
  children: React.ReactNode;
}

export function TaskModal({ task, children }: TaskModalProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="overflow-auto p-4 rounded-3xl w-full md:!max-w-4xl flex flex-col"
        style={{ height: "clamp(660px, 90vh, 800px)" }}
        onPointerDownOutside={e => {
          const target = e.target as Element;
          if (
            target.closest("[data-radix-dropdown-menu-content]") ||
            target.closest("[data-radix-dropdown-menu-trigger]")
          ) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <DialogTitle className="sr-only">{task.title}</DialogTitle>

        <section className="grid grid-cols-1 md:grid-cols-2 justify-between flex-1 min-h-0 h-full">
          <TaskDetails task={task} className="flex flex-col min-h-0" />
          <TaskComments task={task} />
        </section>
      </DialogContent>
      {isMobile && open && (
        <Button
          className="fixed top-4 right-4 rounded-full h-fit w-fit p-2 cursor-pointer z-[999]"
          onClick={() => setOpen(false)}
          variant="outline"
          size="icon"
        >
          <XIcon className="w-6 h-6 text-black" />
        </Button>
      )}
    </Dialog>
  );
}
