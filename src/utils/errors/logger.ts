import * as Sentry from "@sentry/nextjs";

/**
 * Centralized error logging utility
 *
 * Use this instead of console.error for consistent error handling
 */

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log error to console and error tracking service
 *
 * @example
 * logError(error, { component: 'CommentList', action: 'delete' });
 */
export function logError(error: unknown, context?: ErrorContext): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Console logging (development)
  console.error("🚨 Error:", {
    message: errorMessage,
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
  });

  // Sentry error tracking
  Sentry.captureException(error, {
    tags: {
      component: context?.component,
      action: context?.action,
    },
    user: context?.userId ? { id: context.userId } : undefined,
    extra: context?.metadata,
  });
}

/**
 * Log warning (non-critical issues)
 */
export function logWarning(message: string, context?: ErrorContext): void {
  console.warn("⚠️ Warning:", {
    message,
    context,
    timestamp: new Date().toISOString(),
  });

  // Sentry warning
  Sentry.captureMessage(message, {
    level: "warning",
    tags: { component: context?.component },
    extra: context?.metadata,
  });
}

/**
 * Log info (debugging/tracking)
 */
export function logInfo(
  message: string,
  context?: Record<string, unknown>
): void {
  console.log("ℹ️ Info:", {
    message,
    context,
    timestamp: new Date().toISOString(),
  });

  // Sentry breadcrumb for debugging
  Sentry.addBreadcrumb({
    message,
    data: context,
  });
}
