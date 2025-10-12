"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollGradientProps {
  scrollRef: React.RefObject<HTMLElement | null>;
  position?: "top" | "bottom";
  height?: string;
  from?: string;
  via?: string;
  to?: string;
  className?: string;
  bgColor?: string;
}

export function ScrollGradient({
  scrollRef,
  position = "top",
  height = "h-12",
  from = "from-white",
  via = "via-white/50",
  to = "to-transparent",
  className,
}: ScrollGradientProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      if (position === "top") {
        const scrolled = element.scrollTop > 0;
        setIsScrolled(scrolled);
      } else {
        // For bottom gradient: show when not scrolled to bottom
        const isAtBottom =
          element.scrollHeight - element.scrollTop === element.clientHeight;
        setIsScrolled(!isAtBottom);
      }
    };

    element.addEventListener("scroll", handleScroll);
    // Check initial state
    handleScroll();

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef, position]);

  const positionClasses =
    position === "top"
      ? `top-0 bg-gradient-to-b ${from} ${via} ${to}`
      : `bottom-0 bg-gradient-to-t ${from} ${via} ${to}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "absolute left-0 right-0 z-10 pointer-events-none",
          height,
          positionClasses,
          className
        )}
      />
    </AnimatePresence>
  );
}
