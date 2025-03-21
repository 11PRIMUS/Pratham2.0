import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { cookies } from "next/headers"
import * as tf from "@tensorflow/tfjs-node"
import sharp from "sharp"

// This would be your actual model loading code
async function loadModel(type: string) {
  try {
    // tf model
    const modelPath = `file://./models/${type}-model/model.json`;
    return await tf.loadLayersModel(modelPath);
  } catch (error) {
    console.error(`Error loading ${type} model:`, error);
    throw new Error(`Failed to load ${type} cancer model`);
  }
}

// Preprocess image for model input
async function preprocessImage(buffer: Buffer, type: string) {
  try {
    // Resize and normalize the image based on the model requirements
    let width = 224
    let height = 224

    // Different models might have different input requirements
    if (type === "brain") {
      width = height = 256
    } else if (type === "breast") {
      width = height = 299
    }

    // Process the image with sharp
    const processedImage = await sharp(buffer).resize(width, height).toBuffer()

    // Convert to tensor
    const tensor = tf.node.decodeImage(processedImage, 3)

    // Normalize pixel values to [0, 1]
    const normalized = tensor.div(tf.scalar(255))

    // Expand dimensions to match model input shape [1, height, width, 3]
    return normalized.expandDims(0)
  } catch (error) {
    console.error("Error preprocessing image:", error)
    throw new Error("Failed to preprocess image")
  }
}

export async function POST(req: NextRequest, { params }: { params: { type: string } }) {
  try {
    // Validate cancer type
    const type = params.type
    if (!["brain", "breast", "skin"].includes(type)) {
      return NextResponse.json({ error: "Invalid cancer type. Supported types: brain, breast, skin" }, { status: 400 })
    }

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      // For non-authenticated users, check query limit
      const cookieStore = cookies()
      const queryCount = Number.parseInt(cookieStore.get("queryCount")?.value || "0")

      if (queryCount >= 3) {
        return NextResponse.json({ error: "Query limit exceeded. Please sign up to continue." }, { status: 429 })
      }

      // Update the query count
      cookieStore.set("queryCount", (queryCount + 1).toString(), {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })
    }

    // Parse the form data
    const formData = await req.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer())

    // Load the appropriate model
    const model = await loadModel(type)

    // Preprocess the image
    const tensor = await preprocessImage(buffer, type)

    // Run prediction
    const predictions = model.predict(tensor)
    const probabilities = predictions.dataSync()

    // Clean up tensors
    tensor.dispose()
    if (typeof predictions.dispose === "function") {
      predictions.dispose()
    }

    // Determine result
    const cancerProbability = probabilities[1] // Assuming binary classification [normal, cancer]
    const hasCancer = cancerProbability > 0.5

    // Generate risk level
    let riskLevel: "low" | "medium" | "high"
    if (cancerProbability < 0.6) riskLevel = "low"
    else if (cancerProbability < 0.8) riskLevel = "medium"
    else riskLevel = "high"

    // Generate recommendations based on cancer type and risk level
    const recommendations = generateRecommendations(type, riskLevel)

    // Generate detailed analysis
    const details = generateDetails(type, hasCancer, cancerProbability)

    // Store the analysis in the database if user is authenticated
    if (session?.user) {
      try {
        await db.analysis.create({
          data: {
            userId: session.user.id,
            type,
            result: hasCancer,
            confidence: cancerProbability * 100,
            riskLevel,
            timestamp: new Date(),
          },
        })

        // Update the user's query count
        await db.user.update({
          where: { id: session.user.id },
          data: { queryCount: { increment: 1 } },
        })
      } catch (error) {
        console.error("Error storing analysis:", error)
      }
    }

    // Return the result
    return NextResponse.json({
      hasCancer,
      confidence: cancerProbability * 100,
      details,
      riskLevel,
      recommendations,
    })
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}

function generateRecommendations(type: string, riskLevel: string): string[] {
  const baseRecommendations = [
    "Consult with a healthcare professional for a comprehensive evaluation",
    "Maintain a healthy lifestyle with proper diet and exercise",
    "Stay informed about cancer screening guidelines",
  ]

  const typeSpecificRecommendations: Record<string, Record<string, string[]>> = {
    brain: {
      low: ["Consider a follow-up scan in 6-12 months", "Monitor for any new or worsening neurological symptoms"],
      medium: [
        "Schedule a consultation with a neurologist",
        "Consider an MRI with contrast for more detailed imaging",
        "Discuss potential biopsy options if recommended",
      ],
      high: [
        "Seek immediate consultation with a neurosurgeon",
        "Prepare for additional diagnostic procedures",
        "Discuss treatment options including surgery, radiation, and chemotherapy",
      ],
    },
    breast: {
      low: ["Continue regular breast self-exams", "Maintain routine mammogram schedule"],
      medium: [
        "Schedule a follow-up with a breast specialist",
        "Consider additional imaging such as ultrasound or MRI",
        "Discuss biopsy options with your healthcare provider",
      ],
      high: [
        "Seek immediate consultation with a breast cancer specialist",
        "Prepare for a biopsy procedure",
        "Discuss treatment planning including surgery options",
      ],
    },
    skin: {
      low: ["Continue regular skin self-exams", "Use sun protection and avoid excessive UV exposure"],
      medium: [
        "Schedule an appointment with a dermatologist",
        "Consider dermoscopy or other specialized skin imaging",
        "Discuss potential biopsy options",
      ],
      high: [
        "Seek immediate consultation with a dermatologist or skin cancer specialist",
        "Prepare for a biopsy procedure",
        "Monitor the lesion for any changes while awaiting your appointment",
      ],
    },
  }

  return [...baseRecommendations, ...typeSpecificRecommendations[type][riskLevel]]
}

function generateDetails(type: string, hasCancer: boolean, probability: number): string {
  if (!hasCancer) {
    return `The analysis indicates a low probability (${(probability * 100).toFixed(2)}%) of cancer. However, regular monitoring and following standard screening guidelines is still recommended.`
  }

  const details: Record<string, string> = {
    brain:
      "Analysis shows potential abnormalities in the brain tissue. The AI model has detected patterns that may indicate the presence of a tumor. The specific location and characteristics of the abnormality would require further evaluation by a specialist.",
    breast:
      "Mammogram analysis indicates potential dense tissue areas that may require further investigation. The AI model has identified patterns consistent with potential malignancy. Additional imaging and possibly a biopsy would be needed for a definitive diagnosis.",
    skin: "The skin lesion shows irregular borders and color variations. The AI model has detected features that are consistent with potential melanoma or other skin cancers. The ABCDE criteria (Asymmetry, Border irregularity, Color variation, Diameter, Evolution) suggest further evaluation is warranted.",
  }

  return details[type]
}