import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MessageSquare, ImageIcon, History, Settings, User } from "lucide-react"
import Link from "next/link"
import ChatInterface from "@/components/chat-interface"
import ImageUploader from "@/components/image-uploader"
import AwarenessRibbon from "@/components/awareness-ribbon"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/50">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link href="/" className="flex items-center gap-2">
              <AwarenessRibbon className="h-5 w-5 text-primary" />
              <span className="text-primary">CancerCare</span>
              <span className="text-muted-foreground">AI</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Access all CancerCare AI features and your history.</p>
          </div>

          <Tabs defaultValue="chat" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Image Analysis
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <ChatInterface />
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Image Analysis</CardTitle>
                  <CardDescription>Upload medical images for AI-powered cancer detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Your History</CardTitle>
                  <CardDescription>View your recent chat conversations and image analyses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-primary/20 rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Chat: Cancer Prevention Methods</h3>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        You asked about effective cancer prevention methods and lifestyle changes...
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-2 text-sm text-primary">
                        View conversation
                      </Button>
                    </div>

                    <div className="border border-primary/20 rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Image Analysis: Skin Lesion</h3>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                          Potential Cancer Detected
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                          Medium Risk
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        You uploaded an image for skin cancer analysis...
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-2 text-sm text-primary">
                        View analysis
                      </Button>
                    </div>

                    <div className="border border-primary/20 rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Chat: Treatment Options</h3>
                        <span className="text-xs text-muted-foreground">1 week ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        You asked about different treatment options for breast cancer...
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-2 text-sm text-primary">
                        View conversation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

