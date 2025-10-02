"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setAcknowledged } from "@/lib/disclaimer-actions";

interface ModalDisclaimerProps {
  initialShow: boolean;
}

export function ModalDisclaimer({ initialShow }: ModalDisclaimerProps) {
  const [isOpen, setIsOpen] = useState(initialShow);

  const handleUnderstand = async () => {
    await setAcknowledged();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[425px] rounded-3xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Beta Version Notice
          </DialogTitle>
          <DialogDescription className="text-left space-y-2 pt-2 text-black/70">
            <p>
              Welcome to the Creator Approval Portal! This application is
              currently in beta testing.
            </p>
            <div className="flex flex-col gap-2 my-5">
              <p>Please be aware that:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Some features may not work as expected</li>
                <li>You may encounter bugs or unexpected behavior</li>
                <li>Performance issues may occur</li>
              </ul>
            </div>
            <p className="text-sm">
              Your feedback helps us improve. Thank you for testing!
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleUnderstand}
            className="w-full rounded-full cursor-pointer"
          >
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
