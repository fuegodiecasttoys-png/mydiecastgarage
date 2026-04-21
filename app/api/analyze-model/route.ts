import { NextResponse } from "next/server"
import OpenAI, { APIError } from "openai"
import { Buffer } from "buffer"
import { normalizeBrand } from "../../lib/brandAliases"
import { BRANDS, COLORS } from "../../lib/constants"

function openAiErrorMessage(err: unknown): string {
  if (err instanceof APIError) {
    const bits = [err.status && String(err.status), err.code, err.message].filter(Boolean)
    return bits.join(" — ") || "OpenAI API error"
  }
  if (err instanceof Error) return err.message
  return String(err)
}

export const runtime = "nodejs"

type AnalyzeResult = {
  brand: string | null
  model: string | null
  color: string | null
  series: string | null
}

function pickNullableString(v: unknown): string | null {
  if (v === null) return null
  if (typeof v === "string") return v
  return null
}

/** Trim + collapse internal whitespace (OCR often double-spaces). */
function collapseWhitespace(s: string): string {
  return s.trim().replace(/\s+/g, " ")
}

/**
 * Letters + digits only, lowercased — tolerates spaces, hyphens, dots, etc.
 * between OCR and canonical BRANDS spellings.
 */
function brandFingerprint(s: string): string {
  return collapseWhitespace(s)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
}

/** Small-string Levenshtein for single-character OCR typos only. */
function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array<number>(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i]![0] = i
  for (let j = 0; j <= n; j++) dp[0]![j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + cost
      )
    }
  }
  return dp[m]![n]!
}

/**
 * Maps OCR / model-reported brand text to exactly one entry in BRANDS, or null.
 * Shared alias + canonical matching first (`brandAliases.normalizeBrand`); fingerprint
 * and Levenshtein only when that returns null. Never returns a string not in BRANDS.
 */
function resolveBrandFromAnalyze(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null
  const fromShared = normalizeBrand(value)
  if (fromShared !== null) return fromShared

  const collapsed = collapseWhitespace(value)
  if (!collapsed) return null

  const fp = brandFingerprint(collapsed)
  if (fp.length < 2) return null
  const fpMatches = BRANDS.filter((b) => brandFingerprint(b) === fp)
  if (fpMatches.length === 1) return fpMatches[0]!
  if (fpMatches.length > 1) return null

  const lower = collapsed.toLowerCase()
  if (lower.length < 3) return null
  const lev1 = BRANDS.filter((b) => levenshtein(lower, b.toLowerCase()) <= 1)
  if (lev1.length === 1) return lev1[0]!

  return null
}

function normalizeColor(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null
  const trimmed = value.trim()
  if (!trimmed) return null

  const exact = COLORS.find(
    (c: string) => c.toLowerCase() === trimmed.toLowerCase()
  )

  return exact ?? trimmed
}

function normalizeModel(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.length > 40 ? trimmed.slice(0, 40) : trimmed
}

function normalizeSeries(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null
  const trimmed = value.trim()
  return trimmed || null
}

function tryParseAnalyzeJson(raw: string): Partial<Record<keyof AnalyzeResult, unknown>> | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const tryParse = (s: string): Partial<Record<keyof AnalyzeResult, unknown>> | null => {
    try {
      const o = JSON.parse(s) as unknown
      if (o && typeof o === "object" && !Array.isArray(o)) {
        return o as Partial<Record<keyof AnalyzeResult, unknown>>
      }
    } catch {
      /* ignore */
    }
    return null
  }

  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) {
    const fromFence = tryParse(fence[1].trim())
    if (fromFence) return fromFence
  }

  const direct = tryParse(trimmed)
  if (direct) return direct

  const match = trimmed.match(/\{[\s\S]*\}/)
  if (match) {
    const fromBrace = tryParse(match[0])
    if (fromBrace) return fromBrace
  }

  return null
}

function fieldsFromPartialParsed(
  parsed: Partial<Record<keyof AnalyzeResult, unknown>>
): Pick<AnalyzeResult, "brand" | "model" | "color" | "series"> {
  return {
    brand: pickNullableString(parsed.brand),
    model: pickNullableString(parsed.model),
    color: pickNullableString(parsed.color),
    series: pickNullableString(parsed.series),
  }
}

export async function POST(req: Request) {
  console.log("[analyze-model] route entered POST")

  try {
    let formData: FormData
    try {
      formData = await req.formData()
    } catch (e) {
      console.error("[analyze-model] formData() failed:", e)
      return NextResponse.json(
        { error: "Failed to read multipart form data" },
        { status: 400 }
      )
    }
    console.log("[analyze-model] formData parsed")

    const fileField = formData.get("file")
    if (fileField === null) {
      console.log("[analyze-model] missing file field")
      return NextResponse.json({ error: "Missing image file" }, { status: 400 })
    }
    if (!(fileField instanceof File)) {
      console.log("[analyze-model] file field not a File:", typeof fileField)
      return NextResponse.json({ error: "Invalid file field" }, { status: 400 })
    }
    const file = fileField

    console.log("[analyze-model] file metadata:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    if (file.size === 0) {
      console.log("[analyze-model] reject: zero-byte file")
      return NextResponse.json({ error: "Empty image file" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      console.log("[analyze-model] reject: unsupported type", file.type)
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type || "(empty)"}` },
        { status: 400 }
      )
    }

    let arrayBuffer: ArrayBuffer
    try {
      arrayBuffer = await file.arrayBuffer()
    } catch (e) {
      console.error("[analyze-model] file.arrayBuffer() failed:", e)
      return NextResponse.json({ error: "Failed to read image file" }, { status: 400 })
    }

    let buffer: Buffer
    let dataUrl: string
    try {
      buffer = Buffer.from(arrayBuffer)
      const base64Image = buffer.toString("base64")
      dataUrl = `data:${file.type};base64,${base64Image}`
    } catch (e) {
      console.error("[analyze-model] base64 / data URL failed:", e)
      return NextResponse.json({ error: "Failed to encode image" }, { status: 500 })
    }

    console.log("[analyze-model] image ready, bytes:", buffer.length)

    const apiKey = process.env.OPENAI_API_KEY
    const hasKey = Boolean(apiKey?.trim())
    console.log("[analyze-model] OPENAI_API_KEY present:", hasKey)
    if (!hasKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is missing" }, { status: 500 })
    }

    /**
     * SDK defaults read OPENAI_ORG_ID / OPENAI_PROJECT_ID and send OpenAI-Organization / OpenAI-Project.
     * Warehouse uses raw fetch with only Bearer — no project scoping. Wrong project env on Vercel → 429
     * insufficient_quota for that project while the same key works elsewhere.
     */
    const openai = new OpenAI({
      apiKey: apiKey!.trim(),
      organization: null,
      project: null,
    })

    /** Match Almacén default: `OPENAI_MODEL` or economical vision model. */
    const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini"

    console.log("[analyze-model] before OpenAI chat.completions", { model })

    let completion: Awaited<ReturnType<OpenAI["chat"]["completions"]["create"]>>
    try {
      completion = await openai.chat.completions.create({
        model,
        temperature: 0,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: [
              "You read PRINTED TEXT on diecast toy packaging only. This is OCR-first text extraction, NOT object recognition.",
              "Do NOT guess, infer from car shape, use general knowledge, or complete missing text.",
              "Only extract clearly readable printed words from the package/card/blister.",
              "If text is not clearly readable for a field, use JSON null for that field (not empty string, not guesses).",
              "model is the MOST IMPORTANT field: the exact vehicle/model name as printed; no corrections; trim spaces; max 40 characters (truncate if longer).",
              "brand: toy line brand if clearly printed (e.g. Hot Wheels, Matchbox, GreenLight).",
              "color: only if explicitly written on the package (e.g. Red, Metallic Blue); otherwise null.",
              "series: sub-line or collection name if clearly visible (e.g. HW Flames, Fast & Furious); otherwise null.",
              "Reply with ONLY valid JSON, no markdown, no commentary. Exact shape:",
              '{"brand":string|null,"model":string|null,"color":string|null,"series":string|null}',
              `Reference lists (prefer exact spellings when text matches): brands: ${BRANDS.join(", ")}; colors: ${COLORS.join(", ")}.`,
            ].join(" "),
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  "Read ONLY visible printed text on this diecast package image. Return strict JSON: brand, model, color, series. Use null when not clearly readable.",
              },
              {
                type: "image_url",
                image_url: {
                  url: dataUrl,
                  /* Lower vision token use than default/auto; helps tight quotas; OCR text on cards usually still readable. */
                  detail: "low",
                },
              },
            ],
          },
        ],
      })
    } catch (e) {
      const detail = openAiErrorMessage(e)
      console.error("[analyze-model] OpenAI request failed:", detail, e)
      return NextResponse.json(
        { error: `OpenAI request failed: ${detail}` },
        { status: 502 }
      )
    }

    console.log("[analyze-model] after OpenAI call")

    const raw = completion.choices[0]?.message?.content ?? ""
    console.log("[analyze-model] OpenAI raw content length:", raw.length)
    console.log("[analyze-model] OpenAI raw (truncated):", raw.slice(0, 800))

    if (!raw.trim()) {
      console.log("[analyze-model] fail: empty assistant content")
      return NextResponse.json({ error: "Empty model response" }, { status: 500 })
    }

    console.log("[analyze-model] before JSON extract")
    const partial = tryParseAnalyzeJson(raw)
    if (partial === null) {
      console.log("[analyze-model] parse failure (no JSON object extracted)")
      return NextResponse.json(
        { error: "Failed to parse analyze response" },
        { status: 502 }
      )
    }
    console.log("[analyze-model] parse success")

    const parsed = fieldsFromPartialParsed(partial)
    console.log("[analyze-model] parsed (pre-normalize):", parsed)

    const result: AnalyzeResult = {
      brand: resolveBrandFromAnalyze(parsed.brand),
      model: normalizeModel(parsed.model),
      color: normalizeColor(parsed.color),
      series: normalizeSeries(parsed.series),
    }

    console.log("[analyze-model] response JSON (normalized):", result)

    return NextResponse.json(result)
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    console.error("[analyze-model] unexpected error:", error)
    return NextResponse.json(
      { error: detail || "Failed to analyze image" },
      { status: 500 }
    )
  }
}