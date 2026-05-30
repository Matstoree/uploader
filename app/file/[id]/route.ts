import { kv } from "@vercel/kv"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const blobUrl = await kv.get<string>(`file:${id}`)
    if (!blobUrl) return new NextResponse("File not found", { status: 404 })
    return NextResponse.redirect(blobUrl, { status: 302 })
  } catch {
    return new NextResponse("Error", { status: 500 })
  }
}
