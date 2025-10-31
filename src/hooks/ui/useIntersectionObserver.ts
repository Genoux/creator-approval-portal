import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  rootMargin?: string;
  threshold?: number | number[];
  initiallyVisible?: boolean;
}

/**
 * Hook for lazy loading components with intersection observer
 * Returns visibility state and ref to attach to element
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    rootMargin = "0px",
    threshold = 0.1,
    initiallyVisible = false,
  } = options;

  const [isVisible, setIsVisible] = useState(initiallyVisible);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible, rootMargin, threshold]);

  return { isVisible, ref };
}
