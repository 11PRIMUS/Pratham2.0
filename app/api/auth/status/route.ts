import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  return NextResponse.json({
    isLoggedIn: !!session?.user,
    user: session?.user
      ? {
          name: session.user.name,
          email: session.user.email,
        }
      : null,
  })
}

