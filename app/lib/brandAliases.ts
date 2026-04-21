import { BRANDS } from "./constants"

const CANONICAL = new Set(BRANDS)

/** Lowercase, trimmed, single-spaced — for lookup keys and comparisons. */
function normKey(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase()
}

/**
 * Normalized alias → exact spelling from `BRANDS`.
 * Keys must be lowercase, single-spaced (same as `normKey` output).
 * Values must be identical to an entry in `BRANDS`.
 */
export const BRAND_ALIASES: Record<string, string> = {
  hw: "Hot Wheels",
  hotwheels: "Hot Wheels",
  "green light": "GreenLight",
  "green-light": "GreenLight",
  greenlight: "GreenLight",
  jada: "Jada Toys",
  minigt: "Mini GT",
  "mini-gt": "Mini GT",
  "pop race": "POP RACE",
  poprace: "POP RACE",
  "inno 64": "INNO64",
  m2: "M2 Machines",
  autoworld: "Auto World",
  "auto world": "Auto World",
}

for (const canonical of Object.values(BRAND_ALIASES)) {
  if (!CANONICAL.has(canonical)) {
    throw new Error(`brandAliases: canonical not in BRANDS: "${canonical}"`)
  }
}

/**
 * Resolves user or OCR text to a single canonical brand from `BRANDS`, or null.
 * Matches: exact brand (case/spacing insensitive), then `BRAND_ALIASES`.
 * Callers that need extra OCR tolerance (e.g. `analyze-model`) may layer fallbacks only after this returns null.
 */
export function normalizeBrand(input: string): string | null {
  if (typeof input !== "string") return null
  const key = normKey(input)
  if (!key) return null

  const viaAlias = BRAND_ALIASES[key]
  if (viaAlias) return viaAlias

  const direct = BRANDS.find((b) => normKey(b) === key)
  return direct ?? null
}
