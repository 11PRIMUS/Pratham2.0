"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import AwarenessRibbon from "./awareness-ribbon"

type CancerType = "brain" | "breast" | "skin"

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cancerType, setCancerType] = useState<CancerType>("skin")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [result, setResult] = useState<null | {
    hasCancer: boolean
    confidence: number
    details: string
    riskLevel: "low" | "medium" | "high"
    recommendations: string[]
  }>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string)
    }
    fileReader.readAsDataURL(file)
    setResult(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please upload an image to analyze.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Create a FormData object to send the file
    const formData = new FormData()
    formData.append("image", selectedFile)
    formData.append("cancerType", cancerType)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress >= 100 ? 100 : newProgress
        })
      }, 500)

      // In a real application, you would send the image to your API
      // const response = await fetch(`/api/analyze/${cancerType}`, {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 3000))
      clearInterval(progressInterval)
      setAnalysisProgress(100)

      // Mock result - in a real app, this would come from your API
      const mockResults = {
        brain: {
          hasCancer: Math.random() > 0.7,
          confidence: 70 + Math.random() * 25,
          details:
            "Analysis shows potential abnormalities in the brain tissue. The AI model has detected patterns that may indicate the presence of a tumor.",
          riskLevel: "medium" as const,
          recommendations: [
            "Consult with a neurologist for a comprehensive evaluation",
            "Consider an MRI for more detailed imaging",
            "Discuss potential biopsy options if recommended by your specialist",
          ],
        },
        breast: {
          hasCancer: Math.random() > 0.7,
          confidence: 75 + Math.random() * 20,
          details:
            "Mammogram analysis indicates potential dense tissue areas that may require further investigation. The AI model has identified patterns consistent with potential malignancy.",
          riskLevel: "medium" as const,
          recommendations: [
            "Schedule a follow-up with a breast cancer specialist",
            "Consider additional imaging such as ultrasound or MRI",
            "Discuss biopsy options with your healthcare provider",
          ],
        },
        skin: {
          hasCancer: Math.random() > 0.7,
          confidence: 80 + Math.random() * 15,
          details:
            "The skin lesion shows irregular borders and color variations. The AI model has detected features that are consistent with potential melanoma or other skin cancers.",
          riskLevel: "high" as const,
          recommendations: [
            "Consult with a dermatologist as soon as possible",
            "Prepare for a potential biopsy procedure",
            "Monitor any changes in the lesion while awaiting your appointment",
          ],
        },
      }

      setResult(mockResults[cancerType])

      toast({
        title: "Analysis complete",
        description: "Your image has been analyzed successfully.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getCancerTypeInfo = (type: CancerType) => {
    switch (type) {
      case "brain":
        return {
          title: "Brain Cancer",
          description: "Upload MRI or CT scan images for brain tumor detection",
          color: "bg-blue-500",
        }
      case "breast":
        return {
          title: "Breast Cancer",
          description: "Upload mammogram or ultrasound images for breast cancer detection",
          color: "bg-pink-500",
        }
      case "skin":
        return {
          title: "Skin Cancer",
          description: "Upload close-up images of skin lesions for melanoma detection",
          color: "bg-amber-500",
        }
    }
  }

  const typeInfo = getCancerTypeInfo(cancerType)

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <AwarenessRibbon className={`h-5 w-5 text-primary`} />
          <label className="text-sm font-medium">Select cancer type for analysis:</label>
        </div>
        <Select value={cancerType} onValueChange={(value) => setCancerType(value as CancerType)}>
          <SelectTrigger>
            <SelectValue placeholder="Select cancer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brain">Brain Cancer</SelectItem>
            <SelectItem value="breast">Breast Cancer</SelectItem>
            <SelectItem value="skin">Skin Cancer</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{typeInfo.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="overflow-hidden border-primary/20">
          <CardContent className="p-0">
            {previewUrl ? (
              <div className="relative aspect-square w-full">
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="object-cover w-full h-full" />
                {result && (
                  <div
                    className={`absolute top-2 right-2 ${result.hasCancer ? "bg-red-500" : "bg-green-500"} text-white text-xs font-bold px-2 py-1 rounded-full`}
                  >
                    {result.hasCancer ? "Potential Cancer Detected" : "No Cancer Detected"}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-muted/30 p-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/10`}>
                  <AwarenessRibbon className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-center">Upload an image for {typeInfo.title.toLowerCase()} analysis</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="image-upload" className="text-sm font-medium">
              Upload medical image:
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </Button>
              <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          </div>

          <Button onClick={handleAnalyze} disabled={!selectedFile || isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Image"
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Analyzing image...</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          )}

          {result && (
            <Card className="mt-4 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  {result.hasCancer ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <h3 className="font-bold text-lg">Analysis Result</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Detection:</span>
                    <span className={result.hasCancer ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                      {result.hasCancer ? "Potential cancer detected" : "No cancer detected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Confidence:</span>
                    <span>{result.confidence.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Risk Level:</span>
                    <span
                      className={
                        result.riskLevel === "high"
                          ? "text-red-500 font-bold"
                          : result.riskLevel === "medium"
                            ? "text-amber-500 font-bold"
                            : "text-green-500 font-bold"
                      }
                    >
                      {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="font-medium">Details:</span>
                    <p className="text-sm mt-1 text-muted-foreground">{result.details}</p>
                  </div>
                  <div className="pt-2">
                    <span className="font-medium">Recommendations:</span>
                    <ul className="text-sm mt-1 text-muted-foreground space-y-1 list-disc pl-5">
                      {result.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
                    <p className="font-medium">Important Note:</p>
                    <p>
                      This is an AI-assisted analysis and should not replace professional medical diagnosis. Please
                      consult with a healthcare provider for proper evaluation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

