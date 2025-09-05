"use client";

import NextImage from "next/image";
import { cn } from "@/lib/utils";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
}

export function Image({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
}: ImageProps) {
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={cn("object-cover", className)}
      priority
    />
  );
}
