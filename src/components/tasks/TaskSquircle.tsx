import { Squircle } from "@squircle-js/react";
import { ImageOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useGetStatusConfirmation } from "@/contexts/StatusConfirmationContext";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { getDisplayLabel, getStatusColors } from "@/utils/status";
import { StatusDropdown } from "../shared/StatusDropdown";
import { Badge } from "../ui/badge";
import { CardDescription, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface TaskSquircleProps {
  task: Task;
  size?: "default" | "modal";
  onLoadingChange?: (loading: boolean) => void;
  className?: string;
  priority?: boolean; // Priority loading for above-the-fold images
}

export function TaskSquircle({
  task,
  size = "default",
  className,
  onLoadingChange,
  priority = false,
}: TaskSquircleProps) {
  const { title, socials, status } = task;
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const url = `https://d3phw8pj0ea6u1.cloudfront.net/${filename}`;
  const isReadOnly = useGetStatusConfirmation() === null;
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const statusColors = getStatusColors(status.label);

  const handleLoadingComplete = () => {
    setIsImageLoading(false);
    onLoadingChange?.(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
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
                "absolute rounded-2xl overflow-hidden flex items-center justify-center",
                size === "default"
                  ? "inset-0 h-full"
                  : "inset-0 md:right-4 h-[420px]",
                imageError && "bg-black/30"
              )}
            >
              {imageError && (
                <ImageOff className="w-6 h-6 opacity-70 text-white" />
              )}
              {!imageError && (
                <Image
                  src={url}
                  alt={title}
                  width={550}
                  height={550}
                  loading={priority ? "eager" : "lazy"}
                  priority={priority}
                  onLoad={handleLoadingComplete}
                  onError={handleImageError}
                  className="flex items-center justify-center object-cover w-full h-full object-center"
                />
              )}
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
                    <Badge className="flex items-center gap-1.5 border-white/10 bg-white/10 backdrop-blur-md rounded-3xl text-white px-2 py-1">
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full border",
                          statusColors.dot,
                          statusColors.border
                        )}
                      />
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
