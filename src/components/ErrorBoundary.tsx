"use client";

import React from "react";
import { logError } from "@/utils/errors";
import { Button } from "./ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error, errorInfo: React.ErrorInfo): ErrorBoundaryState {
    return { hasError: true, error, errorInfo };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error with full context
    logError(error, {
      component: "ErrorBoundary",
      action: "component_error",
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 flex-col gap-4">
          <div className="flex flex-col justify-center items-center max-w-md text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-base text-muted-foreground mt-2">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <details className="mt-4 text-left w-full">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto max-h-60">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              className="rounded-full cursor-pointer"
              onClick={() => {
                this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                window.location.reload();
              }}
            >
              Refresh Page
            </Button>
            <Button
              className="rounded-full cursor-pointer"
              variant="outline"
              onClick={() => {
                window.open("mailto:dev@inbeat.agency", "_blank");
              }}
            >
              Contact Support
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
