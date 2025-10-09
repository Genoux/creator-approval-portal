import { Squircle } from "@squircle-js/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
//import Image from "next/image";
import { useState } from "react";
import { useGetStatusConfirmation } from "@/contexts/StatusConfirmationContext";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { getDisplayLabel } from "@/utils/status";
import { StatusDropdown } from "../shared/StatusDropdown";
import { Badge } from "../ui/badge";
import { CardDescription, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface TaskSquircleProps {
  task: Task;
  size?: "default" | "modal";
  onLoadingChange?: (loading: boolean) => void;
  className?: string;
}

export function TaskSquircle({
  task,
  size = "default",
  className,
  onLoadingChange,
}: TaskSquircleProps) {
  const { title, socials, status } = task;
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const url = `https://d3phw8pj0ea6u1.cloudfront.net/${filename}`;
  const isReadOnly = useGetStatusConfirmation() === null;
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsImageLoading(false);
    onLoadingChange?.(false);
  };

  return (
    <div className={cn("relative", className)} data-loading={isImageLoading}>
      {isImageLoading && (
        <div
          className={cn("absolute inset-0 z-10", size === "modal" && "md:pr-4")}
        >
          <Skeleton className="w-full h-full border overflow-hidden rounded-2xl" />
        </div>
      )}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isImageLoading ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <Squircle
            cornerRadius={16}
            cornerSmoothing={1}
            className={cn(
              "transition-colors w-full overflow-hidden will-change-transform flex-shrink-0",
              size === "modal" ? "h-[420px]" : "h-[400px]"
            )}
          >
            <div
              className={cn(
                "absolute rounded-2xl overflow-hidden",
                size === "default"
                  ? "inset-0 h-full"
                  : "inset-0 md:right-4 h-[420px]"
              )}
            >
              <Image
                src={url}
                alt={title}
                width={550}
                height={550}
                loading="lazy"
                onLoad={handleLoadingComplete}
                className="flex items-center justify-center object-cover w-full h-full object-center"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[150px] pointer-events-none bg-gradient-to-b from-transparent via-black/70 to-black"></div>
              {/* Content Overlay */}
              <div className="absolute inset-2 flex self-end flex-wrap justify-between gap-2 p-3 text-white items-end">
                <div className="flex flex-col">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg font-semibold flex items-center leading-none">
                      {title}
                    </CardTitle>

                    <CardDescription className="text-white/80 text-sm">
                      <p>{socials[0]?.handle}</p>
                    </CardDescription>
                  </div>
                </div>
                {isReadOnly ? (
                  <div className="flex items-center gap-2">
                    <Badge className="border-white/10 bg-white/10 backdrop-blur-md rounded-3xl text-white px-2 py-1">
                      {getDisplayLabel(status.label)}
                    </Badge>
                  </div>
                ) : (
                  <StatusDropdown task={task} />
                )}
              </div>
            </div>
          </Squircle>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
