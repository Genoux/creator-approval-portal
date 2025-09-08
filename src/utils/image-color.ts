/**
 * Utility to extract predominant color from images and create gradients
 */

interface ColorResult {
  hex: string;
  rgb: { r: number; g: number; b: number };
}

/**
 * Extracts the predominant color from an image
 */
export async function extractImageColor(
  imageUrl: string
): Promise<ColorResult | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(null);
          return;
        }

        // Use smaller canvas for performance
        const size = 50;
        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(img, 0, 0, size, size);
        const imageData = ctx.getImageData(0, 0, size, size);

        const colorCounts: { [key: string]: number } = {};

        // Sample every 4th pixel for performance
        for (let i = 0; i < imageData.data.length; i += 16) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];

          // Skip very light/dark colors
          const brightness = (r + g + b) / 3;
          if (brightness < 30 || brightness > 225) continue;

          const colorKey = `${Math.floor(r / 20) * 20},${
            Math.floor(g / 20) * 20
          },${Math.floor(b / 20) * 20}`;
          colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }

        // Find most common color
        const predominantColor = Object.keys(colorCounts).reduce((a, b) =>
          colorCounts[a] > colorCounts[b] ? a : b
        );

        if (!predominantColor) {
          resolve(null);
          return;
        }

        const [r, g, b] = predominantColor.split(",").map(Number);
        const hex = `#${r.toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

        resolve({ hex, rgb: { r, g, b } });
      } catch (error) {
        console.warn("Error extracting color:", error);
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}

/**
 * Darkens a color by a percentage
 */
export function darkenColor(
  color: ColorResult,
  percentage: number = 0.3
): ColorResult {
  const factor = 1 - percentage;
  const r = Math.floor(color.rgb.r * factor);
  const g = Math.floor(color.rgb.g * factor);
  const b = Math.floor(color.rgb.b * factor);

  const hex = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return { hex, rgb: { r, g, b } };
}

/**
 * Creates a gradient CSS string from image color
 */
export function createImageGradient(
  color: ColorResult,
  direction: string = "to bottom"
): string {
  return `linear-gradient(${direction}, transparent 0%, transparent 70%, ${color.hex}08 85%, ${color.hex}15 100%), linear-gradient(${direction}, transparent 0%, transparent 60%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0.3) 100%)`;
}

/**
 * Hook to get image color and gradient
 */
export function useImageColor(imageUrl: string | null) {
  const [gradient, setGradient] = React.useState<string>(
    "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))"
  );
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!imageUrl) return;

    setIsLoading(true);
    extractImageColor(imageUrl)
      .then((color) => {
        if (color) {
          setGradient(createImageGradient(color));
        }
      })
      .finally(() => setIsLoading(false));
  }, [imageUrl]);

  return { gradient, isLoading };
}

// Add React import for the hook
import React from "react";
