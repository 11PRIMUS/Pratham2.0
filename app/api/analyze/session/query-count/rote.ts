import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const queryCount = Number.parseInt(cookieStore.get("queryCount")?.value || "0")

  return NextResponse.json({ count: queryCount })
}

export async function POST(req: NextRequest) {
  const { count } = await req.json()

  const cookieStore = cookies()
  cookieStore.set("queryCount", count.toString(), {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return NextResponse.json({ success: true })
}

