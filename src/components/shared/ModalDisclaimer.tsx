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
        className="sm:max-w-[576px] rounded-3xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Early Access
          </DialogTitle>
          <DialogDescription className="text-left space-y-2 pt-2 text-black/70">
            <p>This platform is currently in early access.</p>
            <div className="flex flex-col gap-2 my-5">
              <p>What to expect:</p>
              <div className="space-y-1 text-sm pl-3">
                <p>• Active development with new features shipping regularly</p>
                <p>• Occasional bugs as we refine the experience</p>
                <p>• Direct support from our team when you need it</p>
              </div>
            </div>
            <p className="text-sm">
              {`Hit any issues? Reach out to support. We're here to help.`}
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
