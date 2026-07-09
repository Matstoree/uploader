import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

const redis = Redis.fromEnv()

export const runtime = "nodejs"

type RouteParams = { params: { id: string } }

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const blobUrl = await redis.get<string>(`file:${params.id}`)
    if (!blobUrl) return new NextResponse("File not found", { status: 404 })

    // 302 + no-store so a re-upload under the same id is never served stale.
    return NextResponse.redirect(blobUrl, {
      status: 302,
      headers: { "Cache-Control": "no-store" },
    })
  } catch {
    return new NextResponse("Error", { status: 500 })
  }
}
