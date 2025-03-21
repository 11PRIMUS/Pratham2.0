"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Loader2 } from "lucide-react"
import { Toaster, toast } from "sonner"

import ImageUploader from "@/components/image-uploader"
import { useChat } from "ai/react"
import AwarenessRibbon from "./awareness-ribbon"

export default function ChatInterface() {
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [queryCount, setQueryCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // In a real app, you would check if the user is logged in
  useEffect(() => {
    // Check if user is logged in by fetching from the API
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/api/auth/status")
        const data = await response.json()
        setIsLoggedIn(data.isLoggedIn)
        if (data.isLoggedIn) {
          // If logged in, fetch the user's query count
          const queryResponse = await fetch("/api/user/query-count")
          const queryData = await queryResponse.json()
          setQueryCount(queryData.count)
        } else {
          // If not logged in, fetch the session query count
          const sessionResponse = await fetch("/api/session/query-count")
          const sessionData = await sessionResponse.json()
          setQueryCount(sessionData.count)
        }
      } catch (error) {
        console.error("Error checking login status:", error)
        setIsLoggedIn(false)

        // Fallback to local storage for demo purposes
        const storedCount = localStorage.getItem("queryCount")
        setQueryCount(storedCount ? Number.parseInt(storedCount) : 0)
      }
    }

    checkLoginStatus()
  }, [])

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    onResponse: async () => {
      if (!isLoggedIn) {
        const newCount = queryCount + 1
        setQueryCount(newCount)

        // In a real app, you would update the session on the server
        try {
          await fetch("/api/session/query-count", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ count: newCount }),
          })
        } catch (error) {
          console.error("Error updating query count:", error)
          // Fallback to local storage for demo purposes
          localStorage.setItem("queryCount", newCount.toString())
        }
      }
    },
    onError: () => {
      toast.error("Failed to send message. Please try again.")
    },
  })

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isLoggedIn && queryCount >= 3) {
      toast.error("Query limit reached. Please sign up to continue using the AI assistant.")
      return
    }

    handleSubmit(e)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border-primary/20 shadow-lg">
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
          <TabsTrigger value="image">Image Analysis</TabsTrigger>
        </TabsList>

        <CardContent className="p-4 md:p-6">
          <TabsContent value="chat" className="mt-0">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-4 h-[400px] overflow-y-auto p-4 bg-muted/30 rounded-md">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <AwarenessRibbon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Ask about cancer</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Get information about symptoms, treatments, prevention, and more.
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleFormSubmit} className="flex items-end gap-2">
                <Textarea
                  placeholder="Ask about cancer symptoms, treatments, or prevention..."
                  value={input}
                  onChange={handleInputChange}
                  className="min-h-[80px] flex-1"
                />
                <Button type="submit" size="icon" disabled={isLoading || (!isLoggedIn && queryCount >= 3)}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>

              {!isLoggedIn && (
                <div className="text-xs text-muted-foreground text-center">
                  {3 - queryCount} {queryCount === 2 ? "query" : "queries"} remaining. Sign up for unlimited access.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="image" className="mt-0">
            <ImageUploader />
          </TabsContent>
        </CardContent>
      </Tabs>
      <Toaster />
    </Card>
  )
}