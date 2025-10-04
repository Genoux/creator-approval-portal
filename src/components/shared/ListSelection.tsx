"use client";

import { LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatorManagement } from "@/contexts/CreatorManagementContext";
import { Button } from "../ui/button";

export function ListSelection() {
  const { sharedLists, setSelectedListId, previousListId, isLoading } =
    useCreatorManagement();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleCancel = () => {
    const listToRestore = previousListId || sharedLists[0]?.listId;
    if (listToRestore) {
      setSelectedListId(listToRestore);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="flex items-center gap-2 relative">
          <LoaderCircle className="w-5 h-5 animate-spin absolute top-0 left-0 opacity-50" />
        </div>
      </div>
    );
  }

  if (sharedLists.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Creator Management Lists Found
          </h2>
          <p className="text-muted-foreground">
            Make sure you have a list named &ldquo;Creator Management&rdquo;
            shared with your account
          </p>
        </div>
      </div>
    );
  }

  if (sharedLists.length === 1) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-md space-y-4 text-start"
        >
          <div>
            <h1 className="text-2xl font-semibold mb-2">Select a list</h1>
            <p className="text-muted-foreground">
              Multiple Creator Management lists found.
            </p>
          </div>

          <Select onValueChange={setSelectedListId}>
            <SelectTrigger className="w-1/2 bg-white">
              <SelectValue placeholder="Choose a workspace..." />
            </SelectTrigger>
            <SelectContent>
              {sharedLists.map(list => (
                <SelectItem key={list.listId} value={list.listId}>
                  {list.listName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
