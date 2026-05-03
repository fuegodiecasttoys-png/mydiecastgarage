import { NextResponse } from "next/server"
import { Buffer } from "buffer"
import { headers } from "next/headers"
import { normalizeBrand } from "../../lib/brandAliases"
import { BRANDS } from "../../lib/constants"
import { createClient as createSupabaseServerClient } from "../../lib/supabaseServer"

export const runtime = "nodejs"

type AnalyzeResult = {
  brand: string | null
  model: string | null
  series: string | null
  /** e.g. 157/250 — printed top-right on the card (mainline / series run). */
  main_number: string | null
  /** e.g. 9/10 — printed mid-right, often in a small colored box (subset of a theme). */
  sub_number: string | null
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

/** Hot Wheels–style NNN/MMM on card; no guessing beyond printed text. */
function normalizeMainSubNumber(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null
  const t = value.trim()
  if (!t) return null
  return t.length > 32 ? t.slice(0, 32) : t
}

/** e.g. "9/10", "157/250" — not words like "F&F" */
const FRACTION_ONLY = /^\s*(\d+)\s*\/\s*(\d+)\s*$/i

/**
 * The model often puts 9/10 in `series` by mistake. `series` must be a theme name, not a fraction.
 * - Denominator &gt;= 50 (e.g. 157/250) → main_number
 * - Smaller (e.g. 9/10) → sub_number
 */
function relocateFractionsFromSeries(
  seriesRaw: string | null,
  mainRaw: string | null,
  subRaw: string | null
): { series: string | null; main_number: string | null; sub_number: string | null } {
  let series = seriesRaw
  let main = mainRaw
  let sub = subRaw

  const s = series?.trim()
  if (!s) {
    return { series, main_number: main, sub_number: sub }
  }

  const m = s.match(FRACTION_ONLY)
  if (!m) {
    return { series, main_number: main, sub_number: sub }
  }

  const b = parseInt(m[2]!, 10)
  const value = s.replace(/\s*\/\s*/i, "/")
  if (Number.isNaN(b)) {
    return { series, main_number: main, sub_number: sub }
  }

  if (b >= 50) {
    if (!main?.trim()) main = value
  } else {
    if (!sub?.trim()) sub = value
  }

  series = null
  return { series, main_number: main, sub_number: sub }
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
): Pick<AnalyzeResult, "brand" | "model" | "series" | "main_number" | "sub_number"> {
  return {
    brand: pickNullableString(parsed.brand),
    model: pickNullableString(parsed.model),
    series: pickNullableString(parsed.series),
    main_number: pickNullableString(parsed.main_number),
    sub_number: pickNullableString(parsed.sub_number),
  }
}

export async function POST(req: Request) {
  const analyzeReqId = req.headers.get("x-analyze-request-id") ?? "(missing)"
  console.log("[analyze-model] route entry", analyzeReqId)

  try {
    const supabase = await createSupabaseServerClient()
    const authHeader = (await headers()).get("authorization")
    const bearerToken =
      authHeader && authHeader.toLowerCase().startsWith("bearer ")
        ? authHeader.slice(7).trim()
        : null
    const {
      data: { user },
      error: authError,
    } = bearerToken
      ? await supabase.auth.getUser(bearerToken)
      : await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 })
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("plan, is_active, monthly_ai_scans, bonus_ai_scans, last_ai_scan_reset")
      .eq("user_id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (profile.plan !== "pro" || profile.is_active !== true) {
      return NextResponse.json({ error: "Pro plan required" }, { status: 403 })
    }

    const today = new Date()
    const lastReset = profile.last_ai_scan_reset
      ? new Date(profile.last_ai_scan_reset)
      : null

    const isNewMonth =
      !lastReset ||
      lastReset.getMonth() !== today.getMonth() ||
      lastReset.getFullYear() !== today.getFullYear()

    let currentAiScans = profile.monthly_ai_scans ?? 0
    let bonusAiScans = profile.bonus_ai_scans ?? 0

    if (isNewMonth) {
      currentAiScans = 0
      const { error: resetError } = await supabase
        .from("profiles")
        .update({
          monthly_ai_scans: 0,
          last_ai_scan_reset: today.toISOString(),
        })
        .eq("user_id", user.id)

      if (resetError) {
        console.error("[analyze-model] monthly reset failed", analyzeReqId)
        return NextResponse.json(
          { error: "Could not reset AI scan period" },
          { status: 500 }
        )
      }
    }

    const monthlyExhausted = currentAiScans >= 50
    if (monthlyExhausted && bonusAiScans <= 0) {
      return NextResponse.json(
        { error: "You used your 50 model scans this month." },
        { status: 402 }
      )
    }

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
    if (!hasKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is missing" }, { status: 500 })
    }

    const keyTrim = process.env.OPENAI_API_KEY!.trim()

    /** Match warehouse default: `OPENAI_MODEL` or economical vision model. */
    const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini"

    const messages = [
      {
        role: "system" as const,
        content: [
          "You read PRINTED TEXT on diecast toy packaging only. This is OCR-first text extraction, NOT object recognition.",
          "Do NOT guess, infer from car shape, use general knowledge, or complete missing text.",
          "Only extract clearly readable printed words from the package/card/blister.",
          "If text is not clearly readable for a field, use JSON null for that field (not empty string, not guesses).",
          "model is the MOST IMPORTANT field: the exact vehicle/model name as printed; no corrections; trim spaces; max 40 characters (truncate if longer).",
          "brand: toy line brand if clearly printed (e.g. Hot Wheels, Matchbox, GreenLight).",
          "series: ONLY a theme/collection name in WORDS (e.g. HW Flames, Fast and Furious). NEVER put numeric fractions in series. A string like 9/10 or 157/250 is never series — use sub_number or main_number.",
          "main_number: ONLY the printed fraction in the UPPER RIGHT of the card (e.g. 157/250 in the top corner/ribbon). Never confuse with the mid-right box.",
          "sub_number: ONLY the printed fraction in a SMALL BOX or banner on the MIDDLE-RIGHT of the art (e.g. 9/10). It is a different number than main_number. If not clearly separate/readable, null.",
          "Reply with ONLY valid JSON, no markdown, no commentary. Exact shape:",
          '{"brand":string|null,"model":string|null,"series":string|null,"main_number":string|null,"sub_number":string|null}',
          `Reference list (prefer exact spellings when text matches): brands: ${BRANDS.join(", ")}.`,
        ].join(" "),
      },
      {
        role: "user" as const,
        content: [
          {
            type: "text" as const,
            text:
              "Read ONLY visible printed text. series = theme name in words if any, never 9/10 or 157/250. main_number = top-right fraction (e.g. 157/250). sub_number = mid-right box (e.g. 9/10). JSON: brand, model, series, main_number, sub_number. null if unreadable.",
          },
          {
            type: "image_url" as const,
            image_url: {
              url: dataUrl,
              detail: "low" as const,
            },
          },
        ],
      },
    ]

    console.log("[analyze-model] before OpenAI fetch", { analyzeReqId, model })

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keyTrim}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 380,
        messages,
      }),
    })

    const openaiBodyText = await openaiRes.text()
    console.log("[analyze-model] OpenAI HTTP status", openaiRes.status, { analyzeReqId })

    if (!openaiRes.ok) {
      let detail = "unknown error"
      try {
        const errJson = JSON.parse(openaiBodyText) as {
          error?: { message?: string; code?: string }
        }
        detail =
          [errJson.error?.code, errJson.error?.message].filter(Boolean).join(" — ") ||
          detail
      } catch {
        detail = openaiBodyText.slice(0, 500) || detail
      }
      console.error("[analyze-model] OpenAI request failed", openaiRes.status, detail, {
        analyzeReqId,
      })
      return NextResponse.json(
        { error: `OpenAI request failed: ${openaiRes.status} — ${detail}` },
        { status: 502 }
      )
    }

    let completion: { choices?: Array<{ message?: { content?: string } }> }
    try {
      completion = JSON.parse(openaiBodyText) as typeof completion
    } catch {
      return NextResponse.json(
        { error: "OpenAI returned non-JSON response" },
        { status: 502 }
      )
    }

    const raw = completion.choices?.[0]?.message?.content ?? ""
    console.log("[analyze-model] OpenAI raw content length:", raw.length, { analyzeReqId })

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

    const relocated = relocateFractionsFromSeries(
      parsed.series,
      parsed.main_number,
      parsed.sub_number
    )
    if (
      relocated.series !== parsed.series ||
      relocated.main_number !== parsed.main_number ||
      relocated.sub_number !== parsed.sub_number
    ) {
      console.log("[analyze-model] relocated fraction out of series:", relocated)
    }

    const result: AnalyzeResult = {
      brand: resolveBrandFromAnalyze(parsed.brand),
      model: normalizeModel(parsed.model),
      series: normalizeSeries(relocated.series),
      main_number: normalizeMainSubNumber(relocated.main_number),
      sub_number: normalizeMainSubNumber(relocated.sub_number),
    }

    const usagePatch =
      monthlyExhausted && bonusAiScans > 0
        ? {
            bonus_ai_scans: bonusAiScans - 1,
            last_ai_scan_reset: today.toISOString(),
          }
        : {
            monthly_ai_scans: currentAiScans + 1,
            last_ai_scan_reset: today.toISOString(),
          }

    const { error: usageUpdateError } = await supabase
      .from("profiles")
      .update(usagePatch)
      .eq("user_id", user.id)

    if (usageUpdateError) {
      console.error("[analyze-model] usage increment failed", analyzeReqId)
      return NextResponse.json(
        { error: "Analyze succeeded, but failed to update scan usage." },
        { status: 500 }
      )
    }

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