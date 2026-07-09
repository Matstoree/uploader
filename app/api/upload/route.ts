import { put } from "@vercel/blob"
import { Redis } from "@upstash/redis"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { getBaseUrl, sanitizeExt } from "@/lib/utils"

const redis = Redis.fromEnv()

// Optional hard limit, in bytes. Set MAX_UPLOAD_MB in your env to override (default 100 MB).
const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_MB ?? 100) * 1024 * 1024

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ status: false, error: "No file provided" }, { status: 400 })
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { status: false, error: `File too large. Max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` },
        { status: 413 }
      )
    }

    const ext = sanitizeExt(file.name)
    const id = nanoid(6)
    const key = `${id}.${ext}`

    const blob = await put(`files/${key}`, file, {
      access: "public",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: false,
    })

    await redis.set(`file:${key}`, blob.url)

    const url = `${getBaseUrl(req)}/file/${key}`

    return NextResponse.json({ status: true, url, blob_url: blob.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload failed"
    return NextResponse.json({ status: false, error: msg }, { status: 500 })
  }
}
