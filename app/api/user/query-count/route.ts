import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { queryCount: true },
    })

    return NextResponse.json({ count: user?.queryCount || 0 })
  } catch (error) {
    console.error("Error fetching query count:", error)
    return NextResponse.json({ error: "Failed to fetch query count" }, { status: 500 })
  }
}

