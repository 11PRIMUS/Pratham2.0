import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { cookies } from "next/headers"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Get the session to check if the user is authenticated
  const session = await getServerSession(authOptions)

  if (session?.user) {
    try {
      // Store the query in the database
      await db.query.create({
        data: {
          userId: session.user.id,
          type: "chat",
          content: messages[messages.length - 1].content,
          timestamp: new Date(),
        },
      })

      // Update the user's query count
      await db.user.update({
        where: { id: session.user.id },
        data: { queryCount: { increment: 1 } },
      })
    } catch (error) {
      console.error("Error storing query:", error)
    }
  } else {
    // **Fix: Await cookies() before using it**
    const cookieStore = await cookies() 

    // **Fix: Await cookieStore.get("queryCount")**
    const queryCount = Number.parseInt((await cookieStore.get("queryCount"))?.value || "0")

    // Limit non-authenticated users to 3 queries
    if (queryCount >= 5) {
      return new Response(
        JSON.stringify({
          error: "Query limit exceeded. Please sign up to continue.",
        }),
        { status: 429 },
      )
    }

    // **Fix: Await cookieStore.set(...)**
    await cookieStore.set("queryCount", (queryCount + 1).toString(), {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })
  }

  const result = streamText({
    model: groq("gemma2-9b-it"),
    system: `You are a helpful AI assistant specializing in cancer-related information. 
    Provide accurate, compassionate, and educational responses about cancer types, 
    symptoms, treatments, prevention, and support resources. 
    
    Always clarify that you're providing general information and not medical advice. 
    Encourage users to consult healthcare professionals for diagnosis and treatment.
    
    Be empathetic when discussing sensitive topics and provide evidence-based information.`,
    messages,
  })

  return result.toDataStreamResponse()
}
