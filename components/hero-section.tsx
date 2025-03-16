import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import AwarenessRibbon from "@/components/awareness-ribbon"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Early Detection Saves Lives
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                AI-Powered Cancer Care Assistant
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Get accurate information about cancer, treatments, and early detection using advanced AI technology.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-1.5">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/resources">
                <Button size="lg" variant="outline">
                  Explore Resources
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[80%] h-[80%] bg-white rounded-lg shadow-lg p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="flex gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                          <AwarenessRibbon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-slate-100 rounded-lg p-3 text-sm max-w-[80%]">
                          Hello! I'm your Cancer Care AI assistant. How can I help you today?
                        </div>
                      </div>
                      <div className="flex gap-4 justify-end">
                        <div className="bg-primary/10 rounded-lg p-3 text-sm max-w-[80%]">
                          What are the early signs of breast cancer?
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold">
                          U
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                          <AwarenessRibbon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-slate-100 rounded-lg p-3 text-sm max-w-[80%]">
                          Early signs of breast cancer may include a new lump in the breast or armpit, thickening or
                          swelling of part of the breast, irritation or dimpling of breast skin, redness or flaky skin,
                          nipple discharge, or any change in the size or shape of the breast...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

