"use client";

import Link from "next/link";
import { InBeatIcon } from "@/components/icons/inBeat";
import { LoginForm } from "@/components/login/LoginForm";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="w-full lg:max-w-[1440px] mx-auto h-svh overflow-hidden">
      <div className=" flex flex-col h-full w-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <InBeatIcon className="w-16 h-16" />
            <Card className="w-full max-w-sm p-8 items-center shadow-none">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold">
                  Creator Approval Portal
                </h1>
                <p className="text-sm text-black/60">
                  Sign in with ClickUp to continue
                </p>
              </div>
              <LoginForm />
            </Card>
            <div className="flex w-full justify-between px-2">
              <p className="text-xs text-black/50">
                v{process.env.APP_VERSION}
              </p>
              <Link
                className="text-xs text-black/50 hover:underline"
                href="mailto:dev@inbeat.agency"
              >
                I need help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
