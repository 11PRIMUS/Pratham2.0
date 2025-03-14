import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Image, MessageSquare, Shield } from "lucide-react"
import HeroSection from "@/components/hero-section"
import ChatInterface from "@/components/chat-interface"
import AwarenessRibbon from "@/components/awareness-ribbon"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/50">
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <AwarenessRibbon className="h-6 w-6 text-primary" />
            <span className="text-primary">CancerCare</span>
            <span className="text-muted-foreground">AI</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
            <Link href="/resources" className="text-sm font-medium hover:underline">
              Resources
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />

        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Empowering Through Knowledge
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Advanced AI tools to help with cancer detection, information, and support
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-16 mt-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI Chat Assistant</h3>
              <p className="text-muted-foreground">
                Get accurate information about cancer types, treatments, and prevention
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Image className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Image Analysis</h3>
              <p className="text-muted-foreground">Upload medical images for AI-powered cancer detection</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Specialized Support</h3>
              <p className="text-muted-foreground">Dedicated resources for brain, breast, and skin cancer awareness</p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container">
            <div className="mx-auto flex flex-col items-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Try the AI Assistant</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Ask questions about cancer or upload an image for analysis
              </p>
            </div>
            <ChatInterface />
            <div className="text-center mt-8 text-sm text-muted-foreground">
              <p>
                Non-registered users are limited to 3 queries.{" "}
                <Link href="/signup" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>{" "}
                for unlimited access.
              </p>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24">
          <div className="mx-auto flex flex-col items-center gap-4">
            <div className="flex items-center justify-center mb-6">
              <AwarenessRibbon className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl">
              Join our community of support
            </h2>
            <p className="text-muted-foreground text-center md:text-xl max-w-[700px]">
              Create an account to access all features, unlimited queries, and connect with resources for cancer
              awareness and support.
            </p>
            <Link href="/signup">
              <Button className="mt-4">
                Sign up now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <div className="flex items-center gap-2">
              <AwarenessRibbon className="h-5 w-5 text-primary" />
              <span className="text-primary font-bold">CancerCare AI</span>
            </div>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 CancerCare AI. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

