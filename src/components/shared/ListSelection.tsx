"use client";

import { CheckIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatorManagement } from "@/hooks/useCreatorManagement";
import { Button } from "../ui/button";

interface ListSelectionProps {
  show: boolean;
  onClose: () => void;
}

export function ListSelection({ show, onClose }: ListSelectionProps) {
  const { sharedLists, setSelectedListId, selectedListId } =
    useCreatorManagement();

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [show]);

  const handleSelectList = (listId: string) => {
    setSelectedListId(listId);
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center px-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-4 text-start"
        >
          <div>
            <h1 className="text-2xl font-semibold mb-2">Select a list</h1>
            <p className="text-muted-foreground">
              Choose a Creator Management list.
            </p>
          </div>

          <Select onValueChange={handleSelectList}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Choose a workspace..." />
            </SelectTrigger>
            <SelectContent>
              {sharedLists.map(list => (
                <SelectItem key={list.listId} value={list.listId}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span>{list.listName}</span>
                    {selectedListId === list.listId && (
                      <CheckIcon className="w-4 h-4 flex-shrink-0" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
