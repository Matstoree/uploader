import { list } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const { blobs } = await list({ prefix: id })
    const blob = blobs.find((b) => b.pathname === id)

    if (!blob) {
      return new NextResponse("File not found", { status: 404 })
    }

    return NextResponse.redirect(blob.url, { status: 302 })
  } catch {
    return new NextResponse("Error fetching file", { status: 500 })
  }
}
