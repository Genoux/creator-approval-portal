"use client";

import NextError from "next/error";
import { useEffect } from "react";
import { logError } from "@/utils/errors";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    logError(error, { component: "GlobalError", action: "render" });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
