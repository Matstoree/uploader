import { put } from "@vercel/blob"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { getBaseUrl } from "@/lib/utils"

export const runtime = "edge"
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ status: false, error: "No file provided" }, { status: 400 })
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "bin"
    const id = nanoid(8)
    const blobName = `${id}.${ext}`

    const blob = await put(blobName, file, {
      access: "public",
      contentType: file.type || "application/octet-stream",
    })

    const base = getBaseUrl(req)
    const url = `${base}/file/${blobName}`

    return NextResponse.json({ status: true, url, blob_url: blob.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload failed"
    return NextResponse.json({ status: false, error: msg }, { status: 500 })
  }
}
