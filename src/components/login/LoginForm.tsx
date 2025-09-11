"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Creator Approval Portal</CardTitle>
          <CardDescription>
            Sign in to access your creator management boards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Button onClick={handleClickUpLogin} className="w-full" size="lg">
              Continue with ClickUp
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Sign in with your ClickUp account to access shared creator
              management boards.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
