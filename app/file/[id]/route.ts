import { Redis } from "@upstash/redis"
import { NextRequest, NextResponse } from "next/server"

const redis = Redis.fromEnv()

export const runtime = "nodejs"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const blobUrl = await redis.get<string>(`file:${id}`)
    if (!blobUrl) return new NextResponse("File not found", { status: 404 })
    return NextResponse.redirect(blobUrl, { status: 302 })
  } catch {
    return new NextResponse("Error", { status: 500 })
  }
}
