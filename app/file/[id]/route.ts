import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const blobUrl = Buffer.from(id, "base64url").toString("utf-8")

    if (!blobUrl.startsWith("https://") || !blobUrl.includes("vercel-storage.com")) {
      return new NextResponse("Invalid file ID", { status: 400 })
    }

    return NextResponse.redirect(blobUrl, { status: 302 })
  } catch {
    return new NextResponse("File not found", { status: 404 })
  }
}
