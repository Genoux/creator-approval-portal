/**
 * Generates S3 URL for task thumbnails
 * Assumes files are named as {taskName}.jpg in S3 bucket
 */

export function getS3ImageUrl(taskName: string): string {
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
  const region = process.env.NEXT_PUBLIC_S3_REGION;
  if (!bucketName || !region) {
    throw new Error("S3 bucket name or region is not set");
  }
  const filename = `${taskName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const url = `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;
  return url;
}
