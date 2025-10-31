"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ClickupColorIcon } from "@/components/icons/clickupColor";
import { InBeatIcon } from "@/components/icons/inBeat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const handleClickUpLogin = () => {
    const popup = window.open(
      "/auth/clickup",
      "clickup-auth",
      "width=500,height=600,scrollbars=yes,resizable=yes"
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "auth_success") {
        cleanup();
        window.location.href = "/dashboard/management";
      }
    };

    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      if (checkClosed) clearInterval(checkClosed);
      popup?.close();
    };

    window.addEventListener("message", handleMessage);

    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        cleanup();
      }
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0 shadow-none">
          <CardContent className="grid p-0 md:grid-cols-2 h-[400px] md:h-[500px]">
            <div className="flex items-center justify-center">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <InBeatIcon className="w-16 h-16" />
                  <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Creator Approval</h1>
                    <p className="text-muted-foreground text-balance">
                      Sign in with ClickUp to continue
                    </p>
                  </div>
                </div>
                <Button
                  variant="default"
                  onClick={handleClickUpLogin}
                  className="w-fit cursor-pointer self-center bg-black hover:bg-black/90"
                  size="lg"
                >
                  <ClickupColorIcon className="w-8 h-8" />
                  <span className="text-sm">Sign in with ClickUp</span>
                </Button>
              </div>
            </div>
            <div className="relative bg-muted hidden md:block">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/login-image.avif"
                  alt="Creator Approval"
                  priority
                  fill
                  style={{ objectFit: "cover" }}
                  className="object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground text-center text-xs text-balance flex justify-between px-2">
          <span>beta-{process.env.APP_VERSION}</span>
          <Link
            href="mailto:dev@inbeat.agency"
            className="hover:underline underline-offset-4"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
