import { MessageSquareIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { CommentSection } from "@/components/comments/CommentSection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTaskComments } from "@/hooks/data/comments/useTaskComments";
import type { Task } from "@/types";
import { TaskComments } from "./TaskComments";
import { TaskDetails } from "./TaskDetails";

interface TaskModalProps {
  task: Task;
  children: React.ReactNode;
}

export function TaskModal({ task, children }: TaskModalProps) {
  const [open, setOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { data: comments = [], isLoading } = useTaskComments(task.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-3xl w-full md:!max-w-4xl px-4 pb-4 pt-3 h-[864px] transition-none md:h-[768px] md:min-h-[720px] max-h-full flex flex-col"
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
        <Button
          className="sm:hidden rounded-full flex self-end"
          onClick={() => setOpen(false)}
          variant="outline"
          size="icon"
        >
          <XIcon className="w-6 h-6 text-black" />
        </Button>
        <DialogTitle className="sr-only">{task.name}</DialogTitle>

        <section className="flex flex-col md:flex-row justify-between gap-4 min-h-0 flex-1">
          <TaskDetails
            task={task}
            className="flex-1 overflow-y-auto sm:p-4 p-0"
          />

          {/* Desktop Comments - Always visible on md+ */}
          <CommentSection
            taskId={task.id}
            className="w-auto flex-1 hidden md:flex"
          />

          {/* Mobile Comments - Overlay */}
          {showComments && (
            <TaskComments
              taskId={task.id}
              comments={comments}
              isLoading={isLoading}
              onClose={() => setShowComments(false)}
            />
          )}
        </section>

        {!showComments && (
          <Button
            onClick={() => setShowComments(true)}
            className="md:hidden rounded-full bg-[#2A0006] hover:bg-[#2A0006]/90 cursor-pointer text-white"
            size="lg"
          >
            <MessageSquareIcon className="w-4 h-4" />
            Comments
          </Button>
        )}
      </DialogContent>
      {open && (
        <Button
          className="hidden sm:flex fixed top-4 right-4 rounded-full h-fit w-fit p-2 cursor-pointer z-[999]"
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
