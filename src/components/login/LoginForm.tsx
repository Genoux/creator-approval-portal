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