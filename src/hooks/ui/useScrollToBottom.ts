import { useCallback, useRef } from "react";

interface UseScrollToBottomOptions {
  /**
   * Delay before scrolling (in ms)
   * @default 100
   */
  delay?: number;
  /**
   * Selector for the scrollable container within the ref element
   * @default "[data-radix-scroll-area-viewport]"
   */
  scrollSelector?: string;
}

/**
 * Custom hook for scrolling to bottom of a scrollable container
 * Provides both automatic scrolling on dependency changes and manual scroll trigger
 */
export function useScrollToBottom(options: UseScrollToBottomOptions = {}) {
  const { delay = 100, scrollSelector = "[data-radix-scroll-area-viewport]" } =
    options;

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current) return;

    setTimeout(() => {
      const scrollContainer = scrollRef.current?.querySelector(scrollSelector);
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }, delay);
  }, [delay, scrollSelector]);

  return {
    scrollRef,
    scrollToBottom,
  };
}
