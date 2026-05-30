import { list } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const blob = await head(id)

    if (!blob) {
      return new NextResponse("File not found", { status: 404 })
    }

    return NextResponse.redirect(blob.url, { status: 302 })
  } catch {
    return new NextResponse("Error fetching file", { status: 500 })
  }
}

