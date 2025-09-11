"use client";

import React from "react";
import { Button } from "./ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
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

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 flex-col gap-4">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-base text-muted-foreground">
              {this.state.error?.message}
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              className="rounded-full cursor-pointer"
              onClick={() => window.location.reload()}
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
