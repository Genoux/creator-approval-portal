import { useCallback, useRef } from "react";

interface UseScrollToBottomOptions {
  /**
   * Delay before scrolling (in ms)
   * @default 100
   */
  delay?: number;
}

/**
 * Custom hook for scrolling to bottom of a scrollable container
 * Provides both automatic scrolling on dependency changes and manual scroll trigger
 */
export function useScrollToBottom(options: UseScrollToBottomOptions = {}) {
  const { delay = 100 } = options;

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current) return;

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, delay);
  }, [delay]);

  return {
    scrollRef,
    scrollToBottom,
  };
}
