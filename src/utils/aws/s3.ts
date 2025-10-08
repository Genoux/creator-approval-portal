/**
 * CloudFront distribution URL for Lambda@Edge image processing
 */
const CLOUDFRONT_URL =
  process.env.NEXT_PUBLIC_CLOUDFRONT_URL ||
  "https://d3phw8pj0ea6u1.cloudfront.net";

/**
 * Image transformation parameters for CloudFront Lambda@Edge
 */
export interface ImageTransformParams {
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  quality?: number;
}

/**
 * Default image transformation parameters
 */
const DEFAULT_TRANSFORM_PARAMS: Partial<ImageTransformParams> = {
  width: 650,
  height: 650,
  fit: "cover",
  quality: 85,
};

/**
 * Normalizes task name to filename format
 * Removes special characters and converts to lowercase
 */
function normalizeFilename(taskName: string): string {
  return taskName.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Generates CloudFront URL with Lambda@Edge image transformations
 * @param taskName - The task name to generate URL for
 * @param params - Optional image transformation parameters
 * @returns CloudFront URL with query parameters for image processing
 */
export function getCloudFrontImageUrl(
  taskName: string,
  params: ImageTransformParams = {}
): string {
  const filename = normalizeFilename(taskName);
  const transformParams = { ...DEFAULT_TRANSFORM_PARAMS, ...params };

  const queryParams = new URLSearchParams();
  if (transformParams.width)
    queryParams.set("width", transformParams.width.toString());
  if (transformParams.height)
    queryParams.set("height", transformParams.height.toString());
  if (transformParams.fit) queryParams.set("fit", transformParams.fit);
  if (transformParams.quality)
    queryParams.set("quality", transformParams.quality.toString());

  return `${CLOUDFRONT_URL}/${filename}?${queryParams.toString()}`;
}
