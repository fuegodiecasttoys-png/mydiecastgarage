import { NextResponse } from "next/server"
import OpenAI from "openai"
import { Buffer } from "buffer"
import { BRANDS, COLORS, IS_PRO } from "../../lib/constants"

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY")
  }

  return new OpenAI({ apiKey })
}

export const runtime = "nodejs"

type AnalyzeResult = {
  brand: string
  model: string
  color: string
}

function normalizeBrand(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""

  const exact = BRANDS.find(
    (b: string) => b.toLowerCase() === trimmed.toLowerCase()
  )

  return exact ?? trimmed
}

function normalizeColor(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""

  const exact = COLORS.find(
    (c: string) => c.toLowerCase() === trimmed.toLowerCase()
  )

  return exact ?? trimmed
}

function extractJson(text: string): AnalyzeResult {
  const match = text.match(/\{[\s\S]*\}/)

  if (!match) {
    return {
      brand: "",
      model: text.trim(),
      color: "",
    }
  }

  const parsed = JSON.parse(match[0]) as Partial<AnalyzeResult>

  return {
    brand: typeof parsed.brand === "string" ? parsed.brand : "",
    model: typeof parsed.model === "string" ? parsed.model : "",
    color: typeof parsed.color === "string" ? parsed.color : "",
  }
}

export async function POST(req: Request) {
  try {
    if (!IS_PRO) {
      return NextResponse.json(
        { error: "Analyze model is a PRO feature" },
        { status: 403 }
      )
    }

    const openai = getOpenAI()

    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      )
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64Image}`

    console.log("analyze-model: calling OpenAI")

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content:
            "You analyze diecast package photos. Reply with ONLY valid JSON. Use this exact shape: {\"brand\":\"\",\"model\":\"\",\"color\":\"\"}. Keep values short. Prioritize visible package text. Do not invent a different model if the package text is readable. Brand is the toy brand on the package. Model is the exact vehicle name shown on the package. Color is the main visible color of the diecast car itself, not the card background.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                `Read this diecast package image.\n` +
                `Return only JSON with brand, model, and color.\n` +
                `Use package text first.\n` +
                `Known brands: ${BRANDS.join(", ")}\n` +
                `Known colors: ${COLORS.join(", ")}`,
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
              },
            },
          ],
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content || ""
    console.log("analyze-model RAW:", raw)

    if (!raw.trim()) {
      return NextResponse.json(
        { error: "Empty model response" },
        { status: 500 }
      )
    }

    const parsed = extractJson(raw)

    const result: AnalyzeResult = {
      brand: normalizeBrand(parsed.brand),
      model: parsed.model.trim(),
      color: normalizeColor(parsed.color),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("analyze-model error:", error)

    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    )
  }
}