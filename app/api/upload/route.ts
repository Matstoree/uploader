import { put } from "@vercel/blob"
import { kv } from "@vercel/kv"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"
import { getBaseUrl } from "@/lib/utils"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ status: false, error: "No file provided" }, { status: 400 })
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "bin"
    const id = nanoid(6)
    const pathname = `files/${id}.${ext}`

    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: false,
    })

    // Simpan mapping: id.ext → blob url
    await kv.set(`file:${id}.${ext}`, blob.url)

    const base = getBaseUrl(req)
    const url = `${base}/file/${id}.${ext}`

    return NextResponse.json({ status: true, url, blob_url: blob.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload failed"
    return NextResponse.json({ status: false, error: msg }, { status: 500 })
  }
}
