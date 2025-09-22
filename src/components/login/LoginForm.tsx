"use client";

import { ClickupColorIcon } from "@/components/icons/clickupColor";
import { Button } from "@/components/ui/button";

export function LoginForm() {
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
        window.location.href = "/dashboard";
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
    <Button
      variant="default"
      onClick={handleClickUpLogin}
      className="w-fit cursor-pointer rounded-full bg-black"
      size="lg"
    >
      <ClickupColorIcon className="w-12 h-12" />
      <span className="text-sm">Sign in with ClickUp</span>
    </Button>
  );
}
