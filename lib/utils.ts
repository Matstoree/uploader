export function getBaseUrl(req?: Request): string {
  if (req) {
    const host = req.headers.get("host") || ""
    const proto = req.headers.get("x-forwarded-proto") || "https"
    return `${proto}://${host}`
  }
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"
}

/** Extracts a safe, lowercase file extension (letters/digits only, max 8 chars). */
export function sanitizeExt(filename: string): string {
  const raw = filename.includes(".") ? filename.split(".").pop() ?? "" : ""
  const clean = raw.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8)
  return clean || "bin"
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
