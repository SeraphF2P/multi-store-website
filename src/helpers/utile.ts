export function toAbsolutePath(path: string): string {
  if (path.startsWith("/")) return path;
  return `/` + path
}
export function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
export function toFilePath(path: string) {
  return getBaseUrl() + path
}