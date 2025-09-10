"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const handleClickUpLogin = () => {
    window.location.href = "/auth/clickup";
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
            <Button 
              onClick={handleClickUpLogin}
              className="w-full"
              size="lg"
            >
              <svg 
                className="mr-2 h-5 w-5" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.568 14.4c-.32.64-1.28 1.12-2.08 1.12-.48 0-.96-.16-1.28-.48l-3.36-2.72c-.32-.24-.48-.64-.48-1.04 0-.4.16-.8.48-1.04l3.36-2.72c.32-.32.8-.48 1.28-.48.8 0 1.76.48 2.08 1.12.32.64.16 1.44-.32 1.92l-2.24 1.84 2.24 1.84c.48.48.64 1.28.32 1.92z"/>
              </svg>
              Continue with ClickUp
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Sign in with your ClickUp account to access shared creator management boards.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}